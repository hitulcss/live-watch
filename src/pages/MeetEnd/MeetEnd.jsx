import { useEffect, useState } from 'react'
import MeetingEnd from '../../components/meetingend/MeetingEnd'
import './MeetEnd.css'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import loginImg from "../../assets/loginImg.png";


const MeetEnd = () => {

    const [attendanceData, setAttendanceData] = useState([])
    const [loading, setLoading] = useState(false)
    const location = useLocation()
   

    useEffect(() => {

        const getAttendance = async () => {
            let helper = []
            location?.state?.lectureId?.map((item) => helper.push(item?.lectureId))
            
            // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkY2FtcHVzQHRyYW5kby5pbiIsInN0dWRlbnRJZCI6IjNjZjcwODYwLTZjMWMtMTFlZC04YjVlLWMxZjc4OTdkMzM5OCIsImFjY2Vzc09iaiI6eyJkZWxldGVBY2Nlc3MiOmZhbHNlLCJhY2Nlc3NGb3JUYWIiOiJyZWFkIiwiYWNjZXNzIjpbImFsbCJdLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGhvdG8iOiJodHRwczovL3N0b3JhZ2UtdXBzY2hpbmRpLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9kYXRhL2ltYWdlcy9hdmF0YXIucG5nIiwidXNlcm5hbWUiOiJTRCBDYW1wdXMiLCJtb2JpbGVObyI6OTk4MzkwNDM5N30sImlhdCI6MTcxMTAxMjk4NywiZXhwIjoxNzExMDk5Mzg3fQ.0WoT'
            const token = localStorage.getItem('token')
            const config = {

            };
            // const data = await axios.get(`https://stage-backend.sdcampus.com/api/v1/getLectureByName?commonName=${commonname}`, config)
            // const data = await axios.get(`https://stage-backend.sdcampus.com/api/v1/adminPanel/getLectureByName?commonName=${`Lecture Name Two12-03-2024 18:30:47`}`, {
            // const data = await axios.get(`http://localhost:3001/api/v1/adminPanel/getLectureByName?commonName=${`Lecture Name Two12-03-2024 18:30:47`}`, {
            //     headers: {
            //         "content-type": "application/json",
            //         authorization: `Bearer ${authToken}`,
            //     },
            // })
            // console.log("lecture details", data)
            axios.post(
                // `http://localhost:3001/api/v1/adminPanel/getLectureByName?commonName=${roomName}`,
                // `https://stage-backend.sdcampus.com/api/v1/adminPanel/getLectureByName?commonName=${roomName}`,
                `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getTimeSpendByMultipleLecture`,
                {
                    lectureIds: helper
                },
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                },

            ).then((res) => {
                
                setAttendanceData(res?.data)

                setLoading(true)
            })
            // const responseJson = await fullResponse.json();
            // console.log('API Response', responseJson?.data)


        }
        getAttendance()

    }, [])



    return (
        <div className="meeting_end_container">
            <img src={loginImg} alt="img" style={{ marginTop: '58px', marginLeft: '15px' }} />
            <MeetingEnd attendanceData={attendanceData} />
        </div>
    )
}

export default MeetEnd
