// MBTA API + AMTRAK JSON (Offline)
import AMTRAKjson from '../public/amtrak.json'

const oldestMBTARecord = 30 * 60 * 1000 // 30 minutes
const AMTRAKRecordRange = 6 * 60 * 60 * 1000 // 6 hours
const timeForBoarding = 15 * 60 * 1000 // 15 minutes. Just for AMTRAK

const MBTA = "MBTA"
const AMTRAK = "AMTRAK"
const TBD = "TBD"

const urlMBTA = "https://api-v3.mbta.com/predictions?filter[stop]=place-north&filter[direction_id]=0&filter[route_type]=2&include=schedule,trip"
const headers = {
}

let currentTime
export const getTimetable = async() => {
    const timetable = 
        await fetch(urlMBTA, { headers })
                .catch(err => { throw(err) })
    
    const result = 
        await timetable.json()
                .catch(err => { throw(err) })
    
    // Current time gets from the server, not a client
    currentTime = new Date(timetable.headers.get('last-modified'))
    return { timetable: parseData(result), date: currentTime}
}

function parseData(data) {
    let parsedRecords = []

    let scheduleMap = {}
    let tripsMap = {}
    
    // Create a scheduleMap of combined both schedule and prediction records
    for (let record of data.included) {
        if (record.type === "schedule")
            scheduleMap[record.id] = { schedule: record, prediction: null }
        else if (record.type == "trip")
            tripsMap[record.id] = { trip: record }
    }

    for (let record of data.data) {
        scheduleMap[record.relationships.schedule.data.id].prediction = record
    }
    //
    
    parsedRecords = generateMBTAList(parsedRecords, scheduleMap, tripsMap)
    parsedRecords = generateAMTRAKList(parsedRecords)
    
    // Sort by departure time
    parsedRecords.sort((r1, r2) => r1.time.getTime() - r2.time.getTime())

    // Convert to human-readable time in en-US locale
    for (let record of parsedRecords) {
        record.time = record.time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    
    return parsedRecords
}

function generateMBTAList(parsedRecords, scheduleMap, tripsMap) {
    for (const key in scheduleMap) {
        if (!scheduleMap.hasOwnProperty(key)) continue
        
        const record = scheduleMap[key]
        const tripID = record.schedule.relationships.trip.data.id
        
        let parsed = {
            id: record.schedule.id,
            carrier: MBTA,
            time: record.prediction.departure_time ?? record.schedule.attributes.departure_time,
            destination: tripsMap[tripID].trip.attributes.headsign,
            train: tripsMap[tripID].trip.attributes.name,
            track: TBD,
            status: record.prediction.attributes.status
        }
        
        parsed.time = new Date(parsed.time)
        
        // Skip records older than `oldestMBTARecord` 
        if (parsed.time.getTime() < currentTime.getTime() - oldestMBTARecord) 
            continue

        // Asign track # if it's ready
        if (record.prediction.relationships.vehicle.data != null ||
            record.prediction.status !== "ON TIME") {
            const stop = record.prediction.relationships.stop.data.id
            const track = parseInt(stop.substring(stop.lastIndexOf("-") + 1))
            if (Number.isInteger(track))
                parsed.track = track 
        }
        parsedRecords.push(parsed)
    }

    return parsedRecords
}

function generateAMTRAKList(parsedRecords) {
    const currentDayList = currentTime.getDay() != 0 && currentTime.getDay() != 6 ? AMTRAKjson.weekDay : AMTRAKjson.weekend
    
    for (const record of currentDayList) {
        let parsed = {
            id: record.train,
            carrier: AMTRAK,
            time: new Date(record.departure_time),
            destination: record.destination,
            train: record.train,
            track: TBD,
            status: "ON TIME"
        }

        parsed.time.setFullYear(currentTime.getFullYear())
        parsed.time.setMonth(currentTime.getMonth())
        parsed.time.setDate (currentTime.getDate())

        // Skip records older than `AMTRAKRecordRange`
        if (parsed.time.getTime() < currentTime.getTime() - AMTRAKRecordRange)
          continue

        // Skip records newer than `AMTRAKRecordRange` 
        if (parsed.time.getTime() > currentTime.getTime() + AMTRAKRecordRange)
          continue

        if (parsed.time < currentTime)
            parsed.status = "DEPARTED"
        else if (parsed.time.getTime() < currentTime.getTime() + timeForBoarding)
            parsed.status = "BOARDING"

        parsedRecords.push(parsed)
    }

    return parsedRecords
}