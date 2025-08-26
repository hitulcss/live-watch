import React, { useState, useContext, useEffect } from "react";
import "./LiveLecture.css";
import { MdForum } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";

import Wrapper from "../components/Wrapper/Wrapper";
// import liveImg from "../../../../../assets/live.png";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { LuSendHorizonal } from "react-icons/lu";
import pdficon from "../../../assets/live/pdf.png";
import downloadpdf from "../../../assets/live/downloadpdf.png";
// import LectureVideos from "../components/LectureVideos/LectureVideos";
import avatarimg from "../../../assets/live/avatar.png";
// import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
// import { CoursesData } from "../../../../../context/courses/Courses";
import socket from "./sockets.js";
// import { Button, TextField } from "@mui/material";
// import CustomVideoPlayer from "./CustomVideoPlayer.js";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.js";
import { useNavigate } from "react-router-dom";
import LiveTabs from "./live_tabs/LiveTabs.js";
import { FaAngleUp } from "react-icons/fa";
import axios from "axios";
import NavBar from "../../../components/Navbar/NavBar.js";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";

import { RiFullscreenFill } from "react-icons/ri";

const LiveLecture = ({ subjectData }) => {
  const navigate = useNavigate();
  if (!localStorage.getItem("isLoggedIn")) {
    navigate("/login");
  }

  const { batchSlug, hashId } = useParams();
  let secretKey = "SDCAMPUS";
  const bytes = CryptoJS.AES.decrypt(
    CryptoJS.enc.Base64.parse(hashId).toString(CryptoJS.enc.Utf8),
    secretKey
  );
  const Id = bytes.toString(CryptoJS.enc.Utf8);

  const [fullScreen, setFullScreen] = useState(true);

  //all batches
  // useEffect(() => {
  const [batchesFromPanel, setBatchesFromPanel] = useState([]);
  const getLeture = async (commonName) => {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkY2FtcHVzQHRyYW5kby5pbiIsInN0dWRlbnRJZCI6IjNjZjcwODYwLTZjMWMtMTFlZC04YjVlLWMxZjc4OTdkMzM5OCIsImFjY2Vzc09iaiI6eyJkZWxldGVBY2Nlc3MiOmZhbHNlLCJhY2Nlc3NGb3JUYWIiOiJyZWFkIiwiYWNjZXNzIjpbImFsbCJdLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGhvdG8iOiJodHRwczovL3N0b3JhZ2UtdXBzY2hpbmRpLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9kYXRhL2ltYWdlcy9hdmF0YXIucG5nIiwidXNlcm5hbWUiOiJTRCBDYW1wdXMiLCJtb2JpbGVObyI6OTk4MzkwNDM5N30sImlhdCI6MTcxMTAxMjk4NywiZXhwIjoxNzExMDk5Mzg3fQ.0WoT'
    const token = localStorage.getItem("token");
    const config = {};

    const fullResponse = await fetch(
      `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getLectureByName?commonName=${commonName}`,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    const responseJson = await fullResponse.json();

    let helperBatch = [];

    responseJson?.data?.map((item) => {
      helperBatch.push({ batchId: item?.batchId, batchName: item?.batchName });
    });

    setBatchesFromPanel(helperBatch);
  };

  // }, [])

  const [isChatVisible, setChatVisible] = useState(false);

  const handleToggleChat = () => {
    setChatVisible((prevVisibility) => !prevVisibility);
  };

  const details = JSON.parse(localStorage.getItem("details"));
  const name = localStorage.getItem("teacher-name");

  const [msg, setMsg] = useState("");
  const [messagelist, setMessageList] = useState([]);
  const [nameOfUser, setNameOfUser] = useState();
  const [IconIfUser, setIconIfUser] = useState("");
  const [isLiveFullScreen, setIsLiveFullScreen] = useState(false);
  const [isChatFullScreen, setIsChatFullScreen] = useState(false);

  //fetching lecture details
  const [lectureDetails, setLectureDetails] = useState();
  const getLectureById = async (id, slug, from = "") => {
    // setLoadingForTwoWay(true);
    const token = localStorage.getItem("token");
    const authToken = token;
    // const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiI5OTUwNjhkMC1hZWVkLTExZWUtYjkzZi0yMTNiYTg0MWRlMjkiLCJpYXQiOjE3MTU4Mzc2NDksImV4cCI6MTcxODQyOTY0OX0.lsUn3cUJ8u_h2fUOZN4npQ-x8kbeeVlWHLBfbkHn6rc';
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    axios
      .get(
        `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getLectureForTwoWay?id=${Id}&batchSlug=${batchSlug}`,
        config
      )
      .then((res) => {
        // setBlog(res?.data?.data);

        setLectureDetails(res?.data?.data);
        getLeture(res?.data?.data?.commonName);
        joinRoom(res?.data?.data?.commonName);
        setTimeout(() => {
          setLoading(false);
        }, 1500);

        // if (from == "two-way") {
        //   // document.getElementById('join-button').click()
        //   setTimeout(() => {

        //   }, 1000);
        // }
      })
      .catch((e) => console.log(e));
  };

  const joinRoom = (roomId) => {
    // const roomId = batchSlug;
    // const roomId = Id;
    socket.emit("create", roomId);
  };
  useEffect(() => {
    // joinRoom();
    getLectureById();
  }, [batchSlug]);
  // console.log('batchSlug')
  const [newMessageScroll, setNewMessageScroll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const sendMessage = async (msgg) => {
    if (msg !== "") {
      setCount(count + 1);
      // const roomId = batchSlug;
      let roomId = lectureDetails?.commonName;
      await socket.emit(
        "send-message",
        msgg,
        name,
        roomId,
        details?.profilePhoto,
        lectureDetails?.batchDetails?.batchName,
        lectureDetails?.batchDetails?.id
      );
      setMsg("");
      if (count >= 7) setNewMessageScroll(50);
    }
  };

  const arrivalMessage = (message, name, userIconUrl, batchName, batchId) => {
    setMessageList((prev) => [
      ...prev,
      {
        message: message,
        name: name,
        icon: userIconUrl,
        batchName: batchName,
        batchId: batchId,
      },
    ]);
  };

  const recieveMessage = () => {
    socket.on(
      "receive-message",
      (message, name, userIconUrl, batchName, batchId) => {
        arrivalMessage(message, name, userIconUrl, batchName, batchId);
        setNameOfUser(name);
        setIconIfUser(userIconUrl);
      }
    );
  };
  useEffect(() => {
    recieveMessage();
  }, [socket]);
  const handleChange = (e) => {
    if (e.target.value !== "") {
      setMsg(e.target.value);
    }
  };

  const [age, setAge] = React.useState("");

  const handleChangeForFilter = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    var elem = document.getElementById("chat-section");
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    } else {
    }
  }, [messagelist]);

  const [selectedBatch, setSelectedBatch] = useState("All");
  return (
    <>
      {!isChatFullScreen && <NavBar />}
      <div className="livelecture_wrapper">
        <div
          style={{
            maxWidth: "1500px",
            padding: "0px 10px",
            width: "100%",
            margin: " 0 auto",
          }}
        >
          <div className="livelecture_container">
            <div
              className="livelecture_upper"
              style={{
                flexDirection: isChatFullScreen ? "column-reverse" : "row",
              }}
            >
              {!isChatFullScreen && (
                <div className="live_left">
                  <div className="left_upper">
                    {" "}
                    {/* <img src={liveImg} alt="Live Img" /> */}
                    {!lectureDetails?.link && loading ? (
                      <div
                        style={{
                          height: "400px",
                          width: "100%",
                          background: "transparent",
                        }}
                      >
                        {" "}
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height="100%"
                        />{" "}
                      </div>
                    ) : (
                      <div className="video_payer_container">
                        {" "}
                        {lectureDetails?.lectureType &&
                          lectureDetails?.LiveOrRecorded && (
                            <div className="live_video_player_container">
                              <VideoPlayer
                                link={lectureDetails?.link}
                                type="Recorded"
                                title={lectureDetails?.lectureTitle}
                              />
                              {/* <VideoPlayer
                            link={lectureDetails?.link}
                            type="Recorded"
                            title={lectureDetails?.lectureTitle}
                          /> */}
                              {/* <h1 className="lecture_title">
                            {lectureDetails?.lectureTitle}
                          </h1> */}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                  <div
                    className="resources_container"
                    style={{ marginTop: loading && "0px" }}
                  >
                    <LiveTabs lectureDetails={lectureDetails} />
                  </div>
                </div>
              )}

              <div
                className={isChatFullScreen ? "live_right_full" : "live_right"}
              >
                {!isChatFullScreen && (
                  <FormControl
                    sx={{
                      m: 1,
                      minWidth: 100,
                      maxWidth: 400,
                      position: "absolute",
                      top: isChatFullScreen ? "-10%" : "-7%",
                      left: "0%",
                    }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Select Batch
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="Batch"
                      onChange={handleChangeForFilter}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <MenuItem
                        value="All"
                        onClick={() => {
                          setSelectedBatch("All");
                        }}
                      >
                        <em>All</em>
                      </MenuItem>
                      {batchesFromPanel?.length > 0 &&
                        batchesFromPanel?.map((item, index) => {
                          return (
                            <MenuItem
                              onClick={() => {
                                setSelectedBatch(item?.batchId);
                              }}
                              value={item?.batchName}
                            >
                              {item?.batchName}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                )}

                {!loading ? (
                  lectureDetails?.LiveOrRecorded == "Live" ? (
                    <div className="live_comment" onClick={handleToggleChat}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <MdForum className="live_icon" />
                        <span>Live Comments</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {!isChatFullScreen ? (
                          <FullscreenIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsChatFullScreen(true);
                              setFullScreen(!fullScreen);
                            }}
                          />
                        ) : (
                          <FullscreenExitIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsChatFullScreen(false);
                            }}
                          />
                        )}
                        {isChatVisible ? (
                          <FaAngleDown className="live_icon" />
                        ) : (
                          <FaAngleUp className="live_icon" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="live_dpp">
                      <p className="live_dpp_title">Resoures shared with you</p>
                      <p style={{ border: "1px solid #e7e7e7" }}></p>
                      {lectureDetails?.material?.fileLoc ||
                      lectureDetails?.dpp?.fileLoc ? (
                        <div className="recorded_dpp">
                          {lectureDetails?.material?.fileName && (
                            <div className="dpp_notes_download">
                              <img src={pdficon} alt="pdficon" />
                              <span className="pdf_name">
                                {" "}
                                {lectureDetails?.material?.fileName}
                              </span>

                              <img src={downloadpdf} alt="downloadpdf" />
                            </div>
                          )}
                          {lectureDetails?.dpp?.fileName && (
                            <div className="dpp_notes_download">
                              <img src={pdficon} alt="pdficon" />
                              <span className="pdf_name">
                                {" "}
                                {lectureDetails?.dpp?.fileName}
                              </span>

                              <img src={downloadpdf} alt="downloadpdf" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="live_dpp_pdf">
                          <div className="dpp_notes_download">
                            No Resources Available
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      background: "transparent",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    ></Skeleton>
                  </div>
                )}

                {/* live chat box  */}

                {!isChatVisible && lectureDetails?.LiveOrRecorded == "Live" && (
                  <div className="chat-box">
                    <div className="inner_chat">
                      <div
                        id="chat-section"
                        style={{
                          overflowY: "scroll",
                          padding: "5px",
                          height: isChatFullScreen ? "68vh" : "45vh",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {messagelist
                          ?.filter(
                            (i) =>
                              i?.batchId == selectedBatch ||
                              selectedBatch === "All"
                          )
                          ?.map((item, index) => {
                            // console.log('item', item)
                            // if (index % 2 == 0) {
                            return (
                              <Stack
                                key={index}
                                direction="row"
                                alignItems="center"
                                justifyContent={name == item?.name ? "" : ""}
                                mb={2}
                                sx={{
                                  width: "100%",
                                  color: name == item?.name ? "green" : "",
                                }}
                              >
                                <div
                                  className="msg-box msg-box-youtube"
                                  style={{
                                    // position: "relative",
                                    marginTop: "5px",
                                    maxWidth: "100%",
                                    background: "none",
                                  }}
                                >
                                  <div
                                    className="from-to-box"
                                    style={{
                                      color: name == item?.name ? "green" : "",
                                      minWidth: "120px",
                                      maxWidth: "120px",
                                    }}
                                  >
                                    <Avatar
                                      src={item?.icon}
                                      style={{ height: "22px", width: "22px" }}
                                    />
                                    {item?.name}{" "}
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {item?.name == name
                                        ? ""
                                        : `(${item?.batchName})`}
                                    </span>
                                  </div>
                                  <p style={{ width: "100%" }}>
                                    {" "}
                                    {item?.message}
                                  </p>
                                </div>
                                {/* <Avatar
                                src={IconIfUser}
                                style={{ height: "30px", width: "30px" }}
                              />{" "}
                              &nbsp;
                              <h5 style={{ textAlign: "start" }}>
                                {item?.name}{name == item?.name ? "" : `(${item?.batchName})`} :{" "}
                              </h5>
                              <br /> &nbsp;
                              <span style={{ fontSize: "12px" }}>
                                {item?.message}
                              </span> */}
                              </Stack>
                            );
                            // } else {
                            //   return;
                            // }
                          })}
                      </div>
                      <p
                        style={{
                          border: "1px solid #e7e7e7",
                          marginTop: "1.5rem",
                        }}
                      ></p>

                      <div className="inner_chat_lower">
                        <Avatar alt="Remy Sharp" src={avatarimg} />
                        <div className="chat_input_box">
                          <input
                            type="text"
                            placeholder="Comment"
                            value={msg}
                            maxlength="200"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                sendMessage(msg);
                              }
                            }}
                          />
                          <LuSendHorizonal
                            className="send_icon"
                            onClick={() => sendMessage(msg)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* live chat box  */}
              </div>
            </div>

            {/* <div className="upcoming_lectures">
              <h2>Upcoming Lectures</h2>
              <LectureVideos
                lecturesOfBatch={lecturesOfBatch}
                batchSlug={subjectData?.batchSlug}
              />
            </div>

            <div className="previous_lectures">
              <h2>Previous Lectures</h2>
              <LectureVideos
                lecturesOfBatch={lecturesOfBatch}
                batchSlug={subjectData?.batchSlug}
              />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveLecture;
