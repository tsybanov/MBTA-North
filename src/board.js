import React from 'react'
import './global.css'

class Board extends React.Component {
    state = {
        timetable: [
            {
                id: "record1",
                carrier: "AMTRAK",
                time: "6:45 PM",
                destination: "PORTLAND, ME",
                train: "697",
                track: "TBD",
                status: "ON TIME"
            },
            {
                id: "record2",
                carrier: "MBTA",
                time: "7:15 PM",
                destination: "NEWBURYPORT",
                train: "2169",
                track: "TBD",
                status: "ON TIME"
            }
        ],
        datetime: {
            date: "07-15-2020",
            weekDay: "Wednesday",
            time: "6:28 PM"
        }
    }
    
    render() {
        return(
            <div className="board">
                <div className="board-top-container">
                    <div className="day-info led">
                        {this.state.datetime.weekDay}<br />
                        {this.state.datetime.date}
                    </div>
                    <div className="center-label">
                        NORTH STATION TRAIN INFORMATION
                    </div>
                    <div className="time-info led">
                        CURRENT TIME<br />
                        {this.state.datetime.time}
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

                {this.state.timetable.map((record) => (
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

            </div>)
    }
}

export default Board