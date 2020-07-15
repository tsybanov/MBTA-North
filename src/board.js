import React from 'react'
import './global.css'
import * as API from './api'

class Board extends React.Component {
    state = {
        timetable: [],
        datetime: {
            time: '--:--'
        },
        isLoaded: false,
        isError: false
    }

    componentDidMount() {
        this.interval = setInterval(this.predictionsUpdate, 4000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    predictionsUpdate = () => {
        API.getTimetable()
            .then((result) => {
                this.setState({
                    timetable: result.timetable,
                    datetime: 
                            { 
                                date:   
                                        (result.date.getMonth() + 1) + "-" + 
                                        result.date.getDate() + "-" +
                                        result.date.getFullYear(),
                                weekDay: 
                                        new Intl.DateTimeFormat('en-US', { weekday: 'long'})
                                                .format(result.date),
                                time: 
                                        result.date
                                            .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                            }, 
                    isLoaded: true
                })
            })
            .catch((err) => {
                this.setState({isError: err})
                console.log(err)
            })
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

                {   /* Loading */
                    !this.state.isLoaded && !this.state.isError && (
                        <div className="board-timetable-records">
                            <div className="led">Loading...</div>
                        </div>
                )}

                {   /* Error on the load */
                    this.state.isError && (
                        <div className="board-timetable-records">
                            <div className="led">Error! Check the console</div>
                        </div>
                    )
                }

                {   /* Loaded */
                    this.state.isLoaded && this.state.timetable.map((record) => (
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