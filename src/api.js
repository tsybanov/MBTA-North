// MBTA API

const oldestRecord = 30 * 60 * 1000 // 30 minutes

const url = "https://api-v3.mbta.com/predictions?filter[stop]=place-north&filter[direction_id]=0&filter[route_type]=2&include=schedule&sort=departure_time"
const headers = {
}

let currentTime
export const getTimetable = async() => {
    const timetable = 
        await fetch(url, { headers })
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
    let map = {}
    
    // Create a map of combined both schedule and prediction records
    for (let record of data.included) {
        map[record.id] = { schedule: record, prediction: null }
    }
    for (let record of data.data) {
        map[record.relationships.schedule.data.id].prediction = record
    }
    //

    for (let key in map) {
        if (!map.hasOwnProperty(key)) continue

        let record = map[key]
        let parsed = {
            id: record.schedule.id,
            carrier: "MBTA",
            time: record.prediction.departure_time ?? record.schedule.attributes.departure_time,
            destination: record.schedule.relationships.route.data.id.substring(3),
            train: "TBD",
            track: "TBD",
            status: record.prediction.attributes.status
        }
        
        parsed.time = new Date(parsed.time)
        
        // Skip records older than `oldestRecord`
        if (parsed.time.getTime() < currentTime.getTime() - oldestRecord) 
            continue

        // Assign trian # if it's ready
        if (record.prediction.relationships.vehicle.data != null)
            parsed.train = record.prediction.relationships.vehicle.data.id
        
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

    // Sort by departure time
    parsedRecords.sort((r1, r2) => r1.time.getTime() - r2.time.getTime())

    // Convert to human-readable time in en-US locale
    for (let record of parsedRecords) {
        record.time = record.time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    
    return parsedRecords
}