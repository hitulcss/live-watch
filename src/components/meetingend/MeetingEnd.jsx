import Draggable from 'react-draggable'
import './MeetingEnd.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import loginImg from "../../assets/loginImg.png";
import * as XLSX from 'xlsx/xlsx.mjs';
const MeetingEnd = ({ lectureData, attendanceData }) => {

  
    const navigate = useNavigate()

    const [forwardButton, setForwardButton] = useState(false)



    const downloadExcel = () => {
        const workbook = XLSX.utils.book_new();

        attendanceData?.data.forEach((lecture, index) => {
       
            const lectureName = lecture?.timeSpendOnLecture[0]?.batchName.substring(0, 29).replace(/[^a-zA-Z ]/g, ""); // Truncate lecture name if necessary
            const timeSpendOnLecture = lecture?.timeSpendOnLecture;
            const worksheet = XLSX.utils.json_to_sheet(timeSpendOnLecture);
            XLSX.utils.book_append_sheet(workbook, worksheet, `${lectureName}${index + 1}`);
        });

        XLSX.writeFile(workbook, 'StudentAnalytics.xlsx');
    }


    return (
        // <Draggable>
        <div className="meeting-end-conatiner">
            <img src={loginImg} alt="img" style={{ opacity: '0.4' }} />
            <h2><GroupsIcon sx={{ fontSize: '50px', color: '#b042f5' }} /> <span style={{ color: '#b042f5' }}>Class Ended</span>  <GroupsIcon sx={{ fontSize: '50px', color: '#b042f5' }} /></h2>
            <div className='meeting-end-mid'>
                <div className='attendace-container'>
                    <div>Attendance</div>
                    <div onClick={() => downloadExcel()}><SystemUpdateAltIcon sx={{ cursor: 'pointer' }} /></div>

                </div>
                {/* <div className='attendace-container'>
                    <div>Attendance</div>
                    <div><SystemUpdateAltIcon sx={{ cursor: 'pointer' }} /></div>

                </div>
                <div className='attendace-container'>
                    <div>Attendance</div>
                    <div><SystemUpdateAltIcon sx={{ cursor: 'pointer' }} /></div>

                </div>
                <div className='attendace-container'>
                    <div>Attendance</div>
                    <div><SystemUpdateAltIcon sx={{ cursor: 'pointer' }} /></div>

                </div> */}

            </div>

            <button onClick={() => {
                navigate('/');
                window.location.reload();


            }}> Go To Home Page   <ArrowForwardIcon sx={{ transition: 'all 0.2s', fontSize: '30px', fontWeight: '700' }} /> </button>
        </div>
        // </Draggable>
    )
}

export default MeetingEnd