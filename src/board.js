import React, { useState, useEffect } from 'react'
import './global.css'
import * as API from './api'
import AMTRAK from '../public/amtrak.json'

export default function Board() {
  const [timetable, setTimetable] = useState()
  const [datetime, setDatetime] = useState({ timeHour: '--', timeMinutes: '--' })
  const [isLoaded, setLoaded] = useState(false)
  const [hasError, setError] = useState(false)
  const [isTimeColumnFlipped, setTimeColumnFlipped] = useState(false)
  const [timeColumnVisibility, setTimeColumnVisibility] = useState()

  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      setTimeColumnFlipped(isTimeColumnFlipped => !isTimeColumnFlipped)
    }, 1000)

    const timetableUpdateInterval = setInterval(timetableUpdate, 4000)

    return () => {
      clearInterval(timeUpdateInterval)
      clearInterval(timetableUpdateInterval)
    }
  }, [])

  useEffect(() => {
    setTimeColumnVisibility(isTimeColumnFlipped ? { "visibility": "visible" } : { "visibility": "hidden" })
  }, [isTimeColumnFlipped])

  const timetableUpdate = async () => {
    const result = await API.getTimetable()

    try {
      result.date = new Date(result.date.toLocaleString("en-US", { timeZone: "America/New_York" }))

      setTimetable(result.timetable)

      setDatetime(
        {
          date:
            (result.date.getMonth() + 1) + "-" +
            result.date.getDate() + "-" +
            result.date.getFullYear(),
          weekDay:
            new Intl.DateTimeFormat('en-US', { weekday: 'long' })
              .format(result.date),
          timeHour: result.date.getHours() % 12 == 0 ?
            12 : result.date.getHours() % 12,
          timeMinutes:
            (result.date.getMinutes() < 10 ?
              "0" + result.date.getMinutes() :
              result.date.getMinutes())
            +
            (result.date.getHours() >= 12 ? " PM" : " AM")
        })

      setLoaded(true)
    }
    catch (err) {
      setError(true)
      console.log(err)
    }
  }

  return (
    <div className="center">
      <div className="board">
        <div className="board-top-container">
          <div className="day-info led">
            {datetime.weekDay}<br />
            {datetime.date}
          </div>
          <div className="center-label">
            NORTH STATION TRAIN INFORMATION
                    </div>
          <div className="time led">
            CURRENT TIME<br />
            <div className="time-info">
              <div className="time-info-hours">
                {datetime.timeHour}
              </div>
              <div className="time-info-column" style={timeColumnVisibility}>:</div>
              <div className="time-info-minuts-and-period">
                {datetime.timeMinutes}
              </div>
            </div>
          </div>
        </div>

        <div className="board-timetable-lables">
          <div className="col-carrier">CARRIER</div>
          <div className="col-time">TIME</div>
          <div className="col-destination">DESTINATION</div>
          <div className="col-train">TRAIN#</div>
          <div className="col-track">TRACK#</div>
          <div className="col-status">STATUS</div>
        </div>

        {   /* Loading */
          !isLoaded && !hasError && (
            <div className="board-timetable-records">
              <div className="led">Loading...</div>
            </div>
          )}

        {   /* Error on the load */
          hasError && (
            <div className="board-timetable-records">
              <div className="led">Error! Check the console</div>
            </div>
          )
        }

        {
          /* No trains in the next couple of hours */
          isLoaded && timetable.length == 0 && (
            <div className="board-timetable-records">
              <div className="led">No trains in the next hours</div>
            </div>
          )
        }

        {   /* Loaded */
          isLoaded && timetable.map((record) => (
            <div key={record.id} className="board-timetable-records">
              <div className="col-carrier led">{record.carrier}</div>
              <div className="col-time led">
                <div className="col-time-inner">{record.time}</div>
              </div>
              <div className="col-destination led">{record.destination}</div>
              <div className="col-train led">{record.train}</div>
              <div className="col-track led">{record.track}</div>
              <div className="col-status led">{record.status}</div>
            </div>
          ))}
      </div>

      <div className="warning-message">
        <b>Be advised</b> that the AMTRAK schedule does not update in real-time.
                Currently, AMTRAK info provided accordingly to <a href={AMTRAK.url} target="_blank">this schedule.</a><br />
        <a href="https://commons.wikimedia.org/wiki/File:North_Station_departure_board.JPG" target="_blank">
          Photo</a> of the board at the station.
            </div>
    </div>
  )
}