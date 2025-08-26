import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './FourthScreen.css'
import { useEffect, useState } from 'react';

const FourthScreen = ({ pollIds, setScreens, setType, type, socket }) => {

    const [leaderBoard, setLeaderBoard] = useState()
    const [options, setOptions] = useState()




    useEffect(() => {
        socket.emit('getPollLeaderBoard', {

            pollIds: pollIds,
            // lectureId: '65eefa1620cc8025a4154b57',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJiMzEzYjEwMC03N2E3LTExZWUtODNiNi04ZmY1OWQwYjRlNDUiLCJpYXQiOjE3MTA2ODE3NjYsImV4cCI6MTcxMDc2ODE2Nn0.uvwX5qulFC1jX4FkG2wakwy7f0xkQfwfJvjsb0HNo50'
        }, (data) => {
            setLeaderBoard(data.data)
            // var obj = { "1": 5, "2": 7, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0 }
            var obj = data.data.optionsPercentage
            var result = Object.keys(obj).map((key) => { return ({ value: obj[key], key: key }) });
            setOptions(result)

        })

    }, [])


    const percentage = 60;
   

    return (
        <div className="second-screen-container">
            <div className="second-screen-top">
                <div className="fourth-screen-top-first-section">
                    {options?.map((item, index) => {
                        return (<div style={{ width: 100, height: 100 }}>
                            <CircularProgressbar value={item.value * 100} maxValue={100} text={`${item?.key} ${item.value * 100}%`} />
                        </div>)
                    })}

                    {/* <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={percentage} maxValue={100} text={`B ${percentage}%`} />
                    </div>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={percentage} maxValue={100} text={`C ${percentage}%`} />
                    </div>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={percentage} maxValue={100} text={`D ${percentage}%`} />
                    </div>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={percentage} maxValue={100} text={`E ${percentage}%`} />
                    </div>
                    <div style={{ width: 100, height: 100 }}>
                        <CircularProgressbar value={percentage} maxValue={100} text={`F ${percentage}%`} />
                    </div> */}


                </div>
                <div className="fourth-screen-top-second-section">
                    <h7>View Leaderboard</h7>
                    <table>

                        <tr className='header-row'>  <th>Rank</th>
                            <th>Name</th>
                            <th>Time</th>
                        </tr>

                        {leaderBoard?.leaderBoard?.length > 0 ? leaderBoard?.leaderBoard?.map((item, index) => {
                            return (<tr key={index}>
                                <td>{item?.rank}</td>
                                <td>{item?.name}</td>
                                <td>{item?.duration}</td>
                            </tr>)
                        }) : 'No Correct Answers..'}



                    </table>
                </div>

            </div>


        </div>
    )
}

export default FourthScreen