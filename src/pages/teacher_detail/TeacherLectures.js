import React, { useEffect, useState } from "react";
import "./TeacherLectures.css";
import NavBar from "../../components/Navbar/NavBar";
import Wrapper from "../../components/Wrapper/Wrapper";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import CryptoJS from "crypto-js";
let dayjs = require("dayjs");
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

function parseDate(dateString) {
  const [day, month, year, hour, minute, second] = dateString.split(/[- :]/);
  return new Date(year, month - 1, day, hour, minute, second);
}

const TeacherLectures = () => {




  const navigate = useNavigate()
  const { teacher_id } = useParams()

  const role = JSON.parse(localStorage.getItem('details'))?.role

  const [teacherLectureList, setTeacherLectureList] = useState([])
  const [loading, setLoading] = useState(false)



  // console.log('Process', process.env.REACT_APP_PRODUCTION_LIVE_URL)
  const teacherLecture = async (id) => {
    setLoading(true)
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkY2FtcHVzQHRyYW5kby5pbiIsInN0dWRlbnRJZCI6IjNjZjcwODYwLTZjMWMtMTFlZC04YjVlLWMxZjc4OTdkMzM5OCIsImFjY2Vzc09iaiI6eyJkZWxldGVBY2Nlc3MiOmZhbHNlLCJhY2Nlc3NGb3JUYWIiOiJyZWFkIiwiYWNjZXNzIjpbImFsbCJdLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGhvdG8iOiJodHRwczovL3N0b3JhZ2UtdXBzY2hpbmRpLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9kYXRhL2ltYWdlcy9hdmF0YXIucG5nIiwidXNlcm5hbWUiOiJTRCBDYW1wdXMiLCJtb2JpbGVObyI6OTk4MzkwNDM5N30sImlhdCI6MTcxMDc0MDg4MSwiZXhwIjoxNzEwODI3MjgxfQ.0Sa9'
    const token = localStorage.getItem('token')
    const config = {

    };


    const fullResponse = await fetch(

      `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getTeacherLectureList?teacherId=${teacher_id}`,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    const responseJson = await fullResponse.json();
    // console.log('teacher list', responseJson?.data)
    setTeacherLectureList(responseJson?.data)
    setLoading(false)

  }
  const modLecture = async (id) => {
    setLoading(true)
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkY2FtcHVzQHRyYW5kby5pbiIsInN0dWRlbnRJZCI6IjNjZjcwODYwLTZjMWMtMTFlZC04YjVlLWMxZjc4OTdkMzM5OCIsImFjY2Vzc09iaiI6eyJkZWxldGVBY2Nlc3MiOmZhbHNlLCJhY2Nlc3NGb3JUYWIiOiJyZWFkIiwiYWNjZXNzIjpbImFsbCJdLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGhvdG8iOiJodHRwczovL3N0b3JhZ2UtdXBzY2hpbmRpLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9kYXRhL2ltYWdlcy9hdmF0YXIucG5nIiwidXNlcm5hbWUiOiJTRCBDYW1wdXMiLCJtb2JpbGVObyI6OTk4MzkwNDM5N30sImlhdCI6MTcxMDc0MDg4MSwiZXhwIjoxNzEwODI3MjgxfQ.0Sa9'
    const token = localStorage.getItem('token')
    const config = {

    };

    const fullResponse = await fetch(

      `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/lecture/getModeratorsLecture?role=moderator`,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    const responseJson = await fullResponse.json();

    setTeacherLectureList(responseJson?.data)
    setLoading(false)

  }
  useEffect(() => {
    if (role == 'moderator') { modLecture() }
    else { teacherLecture() }
  }, [])

  const startLecture = (item) => {
    const d = new Date()
    const curr_date = new Date();


    const startDate = parseDate(item?.starting_date);
    const endDate = parseDate(item?.ending_date);
    if (item?.lectureType == "TWOWAY") {
      if (curr_date >= startDate && curr_date <= endDate) {


        let lect_name = item?.commonName?.split('/*/')[0]
        let date = item?.commonName?.split('/*/')[1]
        let newCommonName2 = item?.commonName?.replace(' ', '-')

        let newCommonName = ''
        for (let i = 0; i < lect_name.length; i++) {

          if (lect_name[i] == ' ') {
            newCommonName = newCommonName + '-'
          } else {
            newCommonName = newCommonName + lect_name[i]
          }
        };
        window.open(`/live/${item?.commonName}`)
      } else if (dayjs(curr_date, 'DD-MM-YYYY HH:mm:ss').isBefore(dayjs(item?.starting_date, 'DD-MM-YYYY HH:mm:ss'))) {
        toast.error(`Lecture is scheduled for ${item?.starting_date}`)
      } else {
        toast.error('Time exceeded..')


      }
    }
    else if (item?.lectureType == "YT") {

      let secretKey = "SDCAMPUS";
      let hashKey = CryptoJS.AES.encrypt(
        String(item?.id),
        secretKey
      ).toString();
      const hasKeyText = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(hashKey)
      );
      window.open(
        `/live-lecture/${item?.batchSlug}/${hasKeyText}`
      );
      // window.open(`/youtube/${item?.id}`)
    }

  }
  const startChat = (item) => {
    const d = new Date()
    const curr_date = new Date();


    const startDate = parseDate(item?.starting_date);
    const endDate = parseDate(item?.ending_date);
    if (item?.lectureType == "TWOWAY") {
      if (curr_date >= startDate && curr_date <= endDate) {


        let lect_name = item?.commonName?.split('/*/')[0]
        let date = item?.commonName?.split('/*/')[1]
        let newCommonName2 = item?.commonName?.replace(' ', '-')

        let newCommonName = ''
        for (let i = 0; i < lect_name.length; i++) {

          if (lect_name[i] == ' ') {
            newCommonName = newCommonName + '-'
          } else {
            newCommonName = newCommonName + lect_name[i]
          }
        };
        window.open(`/chat-page/${item?.commonName}`)
      } else if (dayjs(curr_date, 'DD-MM-YYYY HH:mm:ss').isBefore(dayjs(item?.starting_date, 'DD-MM-YYYY HH:mm:ss'))) {
        toast.error(`Lecture is scheduled for ${item?.starting_date}`)
      } else {
        toast.error('Time exceeded..')


      }
    }
    else if (item?.lectureType == "YT") {

      let secretKey = "SDCAMPUS";
      let hashKey = CryptoJS.AES.encrypt(
        String(item?.id),
        secretKey
      ).toString();
      const hasKeyText = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(hashKey)
      );
      window.open(
        `/live-lecture/${item?.batchSlug}/${hasKeyText}`
      );
      // window.open(`/youtube/${item?.id}`)
    }

  }

  // let filteredArray = teacherLectureList?.length > 0 ? teacherLectureList?.filter(i => i?.lectureType == 'TWOWAY') : []
  let filteredArray = teacherLectureList

  return (
    <>
      <Toaster />
      <NavBar />
      <div className="lecture_wrapper">
        {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80vh' }}>

          <CircularProgress />
        </div> : <Wrapper>
          <div className="lecture_upper_lecture">
            <FaArrowLeftLong className="lecture_icon" onClick={() => navigate('/teachers')} />
            <h1>All lectures</h1>
          </div>
          <div className="lecture_container">
            {filteredArray?.length > 0 ? filteredArray?.map((item, index) => (
              <div className="lecture_box" key={index}>
                <div className="lecture_left">
                  <h2 style={{ textAlign: 'left', width: '100%', overflowX: 'hidden' }}>
                    {` ${item.lectureTitle}${" "}(${item?.lectureType == 'YT' ? 'Youtube' : "Two-Way"})`}

                  </h2>
                  <h2 style={{ fontSize: '15px', textAlign: 'left', fontWeight: '500' }}>{`${item?.batchDetails?.batchName}`}</h2>
                  <div className="lecture_left_details">   <p><span style={{ fontWeight: '500' }}>Duration</span> - {item.duration} min</p>
                    <p><span style={{ fontWeight: '500' }}>Date</span> - {item.starting_date?.split(' ')[0]}</p>
                    <p><span style={{ fontWeight: '500', fontSize: '13px' }}>Time</span> - {item.starting_date?.split(' ')[1]}- {item.ending_date?.split(' ')[1]}</p>
                    {/* <p>Ending - {item.ending_date}</p> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className="lecture_right">
                  <button onClick={() => startLecture(item)} >
                    Start <FaCircleChevronRight className="lecture-icon" />
                  </button>
                  <button onClick={() => startChat(item)} >
                    Start Chat<FaCircleChevronRight className="lecture-icon" />
                  </button>
                </div>
              </div>
            )) : <div className="not_found">   No Lectures Scheduled for Today !</div>}
          </div>
        </Wrapper>}
      </div>
    </>
  );
};

export default TeacherLectures;
