import React, { useEffect, useState } from "react";
import "./TeachersPage.css";
import NavBar from "../../components/Navbar/NavBar";
import Wrapper from "../../components/Wrapper/Wrapper";
import { FaArrowLeftLong } from "react-icons/fa6";
import sir from "../../assets/sir.png";
import mam from "../../assets/mam.png";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Stack } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const TeachersPage = () => {
  const teachers = [
    {
      img: sir,
      teacherName: "Agar Sir",
      subject: "Mathmatics",
    },
    {
      img: mam,
      teacherName: "Niharika Mam",
      subject: "English",
    },
    {
      img: sir,
      teacherName: "Agar Sir",
      subject: "Mathmatics",
    },
    {
      img: mam,
      teacherName: "Niharika Mam",
      subject: "English",
    },
    {
      img: sir,
      teacherName: "Agar Sir",
      subject: "Mathmatics",
    },
    {
      img: mam,
      teacherName: "Niharika Mam",
      subject: "English",
    },
  ];

  const [teacherList, setTeacherlist] = useState([]);
  const [teacherLectureList, setTeacherLectureList] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getLeture = async () => {
      setLoading(true);
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkY2FtcHVzQHRyYW5kby5pbiIsInN0dWRlbnRJZCI6IjNjZjcwODYwLTZjMWMtMTFlZC04YjVlLWMxZjc4OTdkMzM5OCIsImFjY2Vzc09iaiI6eyJkZWxldGVBY2Nlc3MiOmZhbHNlLCJhY2Nlc3NGb3JUYWIiOiJyZWFkIiwiYWNjZXNzIjpbImFsbCJdLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGhvdG8iOiJodHRwczovL3N0b3JhZ2UtdXBzY2hpbmRpLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9kYXRhL2ltYWdlcy9hdmF0YXIucG5nIiwidXNlcm5hbWUiOiJTRCBDYW1wdXMiLCJtb2JpbGVObyI6OTk4MzkwNDM5N30sImlhdCI6MTcxMDc0MDg4MSwiZXhwIjoxNzEwODI3MjgxfQ.0Sa9'
      const token = localStorage.getItem("token");
      const config = {};

      const fullResponse = await fetch(
        // `http://localhost:3001/api/v1/adminPanel/getTeacherList`,
        // `https://stage-backend.sdcampus.com/api/v1/adminPanel/getTeacherList`,
        `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getTeacherList`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const responseJson = await fullResponse.json();
      setTeacherlist(responseJson?.data);
      setFilteredArray(responseJson?.data);
      setLoading(false);
      // console.log('teacher list', responseJson?.data)
    };
    getLeture();
  }, []);

  // console.log('Teacher', teacherList)
  const navigate = useNavigate();

  //filter
  const [filteredArray, setFilteredArray] = useState([]);
  const onChangeHandler = (e) => {
    let arr = teacherList?.filter(
      (item) =>
        item?.name?.toLowerCase()?.includes(e.target.value?.toLowerCase()) ||
        e.target.value === ""
    );
    setFilteredArray(arr);
  };

  return (
    <>
      <NavBar />
      <div className="teacherspage_wrapper">
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "80vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Wrapper>
            <div className="lecture_upper">
              <Stack direction="row" alignItems="center" spacing={2}>
                {" "}
                <FaArrowLeftLong
                  className="lecture_icon"
                  onClick={() => navigate("/")}
                />
                <h1>All Teachers</h1>
              </Stack>
              <FormControl
                sx={{ m: 1, width: "25ch", marginRight: "10px" }}
                variant="rounded"
              >
                <OutlinedInput
                  variant="rounded"
                  id="outlined-adornment-weight"
                  onChange={onChangeHandler}
                  endAdornment={
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  placeholder="Search..."
                />
              </FormControl>
            </div>

            <div className="teacherspage_container">
              {filteredArray?.map((item, index) => (
                <div className="educator_profile" key={index}>
                  <img src={item?.profile} alt="profile" />
                  <div className="details">
                    <p className="name">{item.name}</p>

                    <p className="sub">
                      {teachers[1].subject ? teachers[1].subject : "subject"}
                    </p>

                    <button
                      onClick={() => {
                        localStorage.setItem("teacher-name", item?.name);
                        navigate(`/teachers-lecture/${item?.id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Wrapper>
        )}
      </div>
    </>
  );
};

export default TeachersPage;
