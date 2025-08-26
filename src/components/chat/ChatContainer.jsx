import { useEffect, useState } from "react";
import "./ChatContainer.css";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Stack, Typography } from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import FilterSection from "./components/FilterSection";
import ReplyIcon from "@mui/icons-material/Reply";
import { ResizablePIP } from "resizable-pip";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Draggable, { DraggableCore } from "react-draggable";
import CancelIcon from "@mui/icons-material/Cancel";
import toast from "react-hot-toast";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Camera } from "@mui/icons-material";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { LuSendHorizonal } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";

const ChatContainer = ({
  setShowParticipantsDirectly,
  showParticipantsDirectly,
  audioPause,
  audioResume,
  roomName,
  sendMessage,
  msgList,
  mySocketId,
  participantsList,
  socket,
  setIsMicOn,
  isMicOn,
  roomNames,
  roomNamesFull,
  batchNames,
  name,
  setMsgList,
  setShowChat,
  userCame, setUserCame
}) => {
  const eventHandler = (e, data) => { };

  const [showParticipants, setShowParticipants] = useState(
    showParticipantsDirectly
  );
  const [roomNameOfUser, setRoomNameOfUser] = useState(["dynamic", "room"]);
  const [reply, setReply] = useState(false);
  const [roomSelect, setRoomSelect] = useState(false);
  const [roomList, setRoomList] = useState(false);
  const [msg, setMsg] = useState("");
  const [hoverId, setHoverId] = useState("");

  const [selectedFilter, setSelectedFilter] = useState({
    batch: "All",
    lecture: roomNames,
    displayName: roomNamesFull?.map((item) => item?.roomName),
    room: "",
  });
  const [selectedRoomForMsg, setSelectedRoomForMsg] = useState({
    batch: "All",
    lecture: "",
    room: roomNames,
    displayName: roomNamesFull?.map((item) => item?.roomName),
    userId: "",
    userName: "",
    to: roomNames,
  });

  useEffect(() => {
    if (roomNames || roomNamesFull) {

      setSelectedFilter({
        batch: "All",
        lecture: roomNames,
        displayName: roomNamesFull?.map((item) => item?.roomName),
        room: "",
      })
      setSelectedRoomForMsg({
        batch: "All",
        lecture: "",
        room: roomNames,
        displayName: roomNamesFull?.map((item) => item?.roomName),
        userId: "",
        userName: "",
        to: roomNames,
      })
    }
  }, [roomNames, roomNamesFull])


  const handleSendMessage = (e) => {
    const { value } = e.target;
    setMsg(value);
  };
  const handleSend = () => {
    if (msg !== "") {
      // if (selectedRoomForMsg?.userName !== '') {
      //     setMsgList((prev) => [...prev, { name: name, msg: msg, roomNameOfUser: selectedRoomForMsg?.room, batch: selectedRoomForMsg?.batch, userId: selectedRoomForMsg?.userId ? selectedRoomForMsg?.userId : '' }])
      // }

      // console.log('Room for chat', { name: name, msg: msg, roomNameOfUser: selectedRoomForMsg?.room, batch: selectedRoomForMsg?.batch, userId: selectedRoomForMsg?.userId ? selectedRoomForMsg?.userId : '', to: selectedRoomForMsg?.userName == '' ? selectedRoomForMsg?.room.toString() : selectedRoomForMsg?.userName })
      sendMessage({
        name: name,
        msg: msg,
        roomNameOfUser: selectedRoomForMsg?.room,
        batch: selectedRoomForMsg?.batch,
        userId: selectedRoomForMsg?.userId ? selectedRoomForMsg?.userId : "",
        to:
          selectedRoomForMsg?.userName == ""
            ? selectedRoomForMsg?.displayName.toString()
            : selectedRoomForMsg?.userName,
        imageUrl: "",
      });
      setMsg("");
    } else {
      toast.error("Type Something...");
    }
  };

  // const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const handleCamera = (id) => {
    if (!id?.videoStatus) {
      participantsList?.forEach((element) => {
        if (id.id !== element.id) {
          if (element?.videoStatus) {
            socket.emit("handle-user-camera", {
              userId: element.id,
              status: false,
              for: "video",
              roomName: roomNames,
            });
            socket.emit("handle-user-camera-toggle", {
              userId: element.id,
              cameraOn: false,
              for: "video",
              roomName: roomNames,
            });
            socket.emit("handle-user-mic-toggle", {
              userId: element.id,
              micOn: false,
              cameraOn: false,
              for: "video",
              roomName: roomNames,
            });
          }
        }
      });
      socket.emit("handle-user-camera", {
        userId: id.id,
        status: !id?.videoStatus,
        for: "video",
        roomName: roomNames,
      });
    } else {
      socket.emit("handle-user-camera", {
        userId: id.id,
        status: !id?.videoStatus,
        for: "video",
        roomName: roomNames,
      });
    }
  };
  const handleMic = (id) => {
    socket.emit("handle-user-mic", {
      userId: id.id,
      status: !id?.audioStatus,
      for: "audio",
      roomName: roomNames,
    });
  };
  const handleUserCameraToggle = (id) => {
    socket.emit("handle-user-camera-toggle", {
      userId: id.id,
      cameraOn: !id?.cameraOn,
      for: "video",
      roomName: roomNames,
    });
    // socket.emit('handle-user-camera-toggle', ({ userId: id.id, cameraOn: !id?.cameraOn, for: 'video', roomName: roomNames }))
  };
  const handleUserMicToggle = (id) => {
    socket.emit("handle-user-mic-toggle", {
      userId: id.id,
      micOn: !id?.micOn,
      cameraOn: id?.cameraOn,
      for: "video",
      roomName: roomNames,
    });
    // socket.emit('handle-user-camera-toggle', ({ userId: id.id, cameraOn: !id?.cameraOn, for: 'video', roomName: roomNames }))
  };

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    var elem = document.getElementById("chat-container");
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    } else {
    }
  }, [msgList]);

  let count = 0;


  //userFilter
  const [filterName, setFilterName] = useState('')

  return (

    <Draggable onDrag={eventHandler}>
      <div className="chat_parent_container" style={{ boxShadow: !userCame && 'none', width: !userCame ? '94%' : '435px', transform: !userCame && 'none', marginRight: !userCame && '0', minHeight: userCame && '79vh', maxHeight: userCame && '79vh' }}>
        <div className="filter">
          <span className="filter-value">
            {`${selectedFilter?.batch}${selectedFilter?.displayName !== ""
              ? `>${selectedFilter?.displayName}`
              : ""
              }`}
          </span>
          {filterOpen ? (
            <>
              <ArrowDropUpIcon
                onClick={() => {
                  setFilterOpen(!filterOpen);
                }}
              />{" "}
              <CancelIcon onClick={() => setShowChat(false)} />
            </>
          ) : (
            <>
              <ArrowDropDownIcon
                onClick={() => {
                  setFilterOpen(!filterOpen);
                }}
              />{" "}
              <CancelIcon onClick={() => setShowChat(false)} />
            </>
          )}
          {filterOpen && (
            <FilterSection
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              setSelectedFilter={setSelectedFilter}
              roomNames={roomNames}
              roomNamesFull={roomNamesFull}
              batchNames={batchNames}
            />
          )}
        </div>

        <div className="chat_top">
          <div
            className="chat_section"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowParticipants(false);
            }}
          >
            <div
              style={{
                background: showParticipants ? "#9603F2" : "white",
                color: showParticipants ? "white" : "",
              }}
            >
              Chat
            </div>
          </div>
          <div
            className="participant_section"
            onClick={(e) => {
              e.stopPropagation();
              setShowParticipants(true);
            }}
          >
            <div
              style={{
                background: showParticipants ? "white" : "#9603F2",
                color: showParticipants ? "#333333" : "white",
              }}
            >
              Participant (
              {participantsList?.filter(i => !i?.isAdmin)?.filter((item) =>
                selectedFilter?.lecture.length > 1
                  ? true
                  : item?.room?.toString() == selectedFilter?.lecture.toString()
              ).length + 1}
              )
            </div>
          </div>
        </div>
        {showParticipants ? (
          <div className="participants_container" style={{ width: !userCame && '95%' }}>
            <div className="particpants_cointainer_participants">
              <div
                className="participant_search_box"
                style={{
                  borderRadius: "10px",
                  // width: "411px",
                  marginTop: "36px",
                  width: !userCame ? '94%' : '411px'
                }}
              >
                <div>
                  {" "}
                  <CiSearch />
                </div>
                <input
                  className="participant_search"
                  type="text"
                  onChange={e => setFilterName(e.target.value)}
                  placeholder="Find What You're Looking For..."
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div
              className="participant_list"
              style={{ marginTop: "80px", width: !userCame ? '95%' : '420px' }}
            >
              <div
                className="particular_participant"
                style={{ borderRadius: "10px" }}
              >
                <div className="particular_participant_left">
                  <Avatar sx={{ borderRadius: "10px", height: 30 }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      sx={{
                        fontWeight: "400",
                        fontSize: "15px",
                        textAlign: "start",
                        color: "#333333",
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        textAlign: "left",
                        color: "#6B7280",
                      }}
                    >
                      Host
                    </Typography>
                  </div>
                </div>
              </div>
              {participantsList?.filter(
                (item) =>
                  item?.name?.toLowerCase()?.includes(filterName?.toLowerCase())
              )
                ?.filter(i => !i?.isAdmin)?.filter((item) =>
                  selectedFilter?.lecture.length > 1
                    ? true
                    : item?.room?.toString() ==
                    selectedFilter?.lecture.toString()
                )
                ?.map((item, index) => {
                  count++;
                  return (
                    <div
                      key={index}
                      className="particular_participant"
                      style={{ borderRadius: "10px" }}
                      onClick={() => setClickedId(item.id)}
                    >
                      <div className="particular_participant_left">
                        <Avatar sx={{ borderRadius: "10px", height: 30 }} />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "400",
                              fontSize: "15px",
                              textAlign: "start",
                            }}
                          >
                            {item?.name}
                          </Typography>
                          <Typography sx={{ fontSize: "10px" }}>
                            {socket.id == item?.id ? "Host" : "Participants"}
                          </Typography>
                        </div>
                      </div>
                      <div className="particular_participant_right">
                        {item?.videoStatus ? (
                          <RemoveRedEyeIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              // setIsCameraOn(!item?.videoStatus)
                              handleCamera(item);
                              // handleUserCameraToggle(item)
                            }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              // setIsCameraOn(!item?.videoStatus)
                              handleCamera(item);
                              // handleUserCameraToggle(item)
                            }}
                          />
                        )}

                        {item?.videoStatus ? (
                          item?.cameraOn ? (
                            <VideocamIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                setIsCameraOn(!item?.cameraOn);
                                handleUserCameraToggle(item);
                              }}
                            />
                          ) : (
                            <VideocamOffIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                setIsCameraOn(!item?.cameraOn);
                                handleUserCameraToggle(item);
                              }}
                            />
                          )
                        ) : (
                          ""
                        )}
                        {item?.videoStatus ? (
                          item?.micOn ? (
                            <MicIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                // audioPause(item)
                                // setIsMicOn(!item?.micOn)
                                handleUserMicToggle(item);
                                // handleMic(item)
                              }}
                            />
                          ) : (
                            <MicOffIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                // audioResume(item)
                                // setIsMicOn(!item?.micOn)
                                handleUserMicToggle(item);
                                // handleMic(item)
                              }}
                            />
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="chat_container_chats">
            <Stack
              id="chat-container"
              spacing={2}
              className="msglist-box"
              sx={{ overflowY: "scroll", minHeight: userCame ? "57vh" : "52vh", maxHeight: userCame ? "57vh" : "52vh" }}
            >
              {msgList?.length > 0
                ? msgList?.map((item, index) => {
                  if (selectedFilter?.lecture?.length > 1) {
                    return (
                      <Stack>
                        {item?.socketId == mySocketId ? (
                          <div
                            className="msg-reply-container"
                            style={{ display: "flex" }}
                          >
                            <Avatar
                              sx={{
                                marginTop: "0px",
                                marginRight: "5px ",
                                borderRadius: "10px",
                                height: 20,
                                width: 20,
                              }}
                            />

                            <Typography
                              onMouseEnter={() => {
                                // setReply(true)
                              }}
                              onMouseLeave={() => {
                                // setReply(false)
                              }}
                              className="usermessage"
                            >
                              <span className="from-to-box" style={{}}>
                                {item?.name}
                                {/* { `${item?.name?.slice(0, 10)}...`} */}
                                {/* from <span style={{ color: '#9603F2' }}>{item?.batchName ? item?.batchName : 'All'}</span> to <span style={{ color: '#9603F2' }}>{item?.to !== '' ? item?.to : 'hi'}</span> */}
                              </span>

                              <span
                                className="msg-box"
                                style={{
                                  fontSize: !userCame && '15px',
                                  maxWidth:
                                    !userCame ? reply && index == hoverId
                                      ? "400px"
                                      : "850px" : reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                  minWidth: !userCame ? reply && index == hoverId
                                    ? "400px"
                                    : "850px" :
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                }}
                              >
                                {item?.msg}
                              </span>
                            </Typography>
                          </div>
                        ) : (
                          <div
                            className="msg-reply-container"
                            onMouseEnter={() => {
                              setReply(true);
                              setHoverId(index);
                            }}
                            onMouseLeave={() => {
                              setReply(false);
                              setHoverId("");
                            }}
                            style={{ display: "flex" }}
                          >
                            <Avatar
                              sx={{
                                marginTop: "0px",
                                marginRight: "5px ",
                                borderRadius: "10px",
                                height: 20,
                                width: 20,
                              }}
                            />
                            <Typography className="usermessage">
                              <span className="from-to-box">
                                {item?.name}

                                {/* {`${item?.name?.slice(0, 10)}...`} from <span style={{ color: '#9603F2' }}>{item?.batchName ? item?.batchName : 'All'}</span> to <span style={{ color: '#9603F2' }}>{item?.to !== '' ? item?.to : roomNamesFull?.map(item => item?.roomName)}</span> */}
                              </span>

                              <span
                                className="msg-box"
                                style={{
                                  maxWidth:
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                  minWidth:
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                  top: userCame && '65vh'
                                }}
                              >
                                {item?.msg}
                              </span>
                            </Typography>
                            <span
                              className="reply"
                              style={{
                                display:
                                  reply && hoverId == index ? "" : "none",
                              }}
                              onMouseEnter={() => {
                                // setReply(true)
                              }}
                              onMouseLeave={() => {
                                // setReply(false)
                              }}
                              onClick={() => {
                                // setRoomNameOfUser(item.roomName.roomName)
                                setSelectedRoomForMsg({
                                  batch: item?.batchName,
                                  room: item?.room,
                                  userId: item?.socketId,
                                  userName: item?.name,
                                });
                              }}
                            >
                              {" "}
                              Reply <ReplyIcon />
                            </span>
                          </div>
                        )}
                      </Stack>
                    );
                  } else if (
                    selectedFilter?.lecture.toString() ==
                    item?.room.toString()
                  ) {
                    // console.log('came here 2')
                    return (
                      <Stack>
                        {item?.socketId == mySocketId ? (
                          <div
                            className="msg-reply-container"
                            style={{ display: "flex" }}
                          >
                            <Avatar
                              sx={{
                                marginTop: "0px",
                                marginRight: "5px ",
                                borderRadius: "10px",
                                height: 20,
                                width: 20,
                              }}
                            />
                            <Typography
                              onMouseEnter={() => {
                                // setReply(true)
                              }}
                              onMouseLeave={() => {
                                // setReply(false)
                              }}
                              className="usermessage"
                            >
                              <span className="from-to-box" style={{}}>
                                {" "}
                                {`${item?.name?.slice(0, 10)}...`}
                                {/* from <span style={{ color: '#9603F2' }}>{item?.batchName ? item?.batchName : 'All'}</span> to <span style={{ color: '#9603F2' }}>{item?.to !== '' ? item?.to : roomNamesFull?.map(item => item?.roomName)}</span> */}
                              </span>

                              <span
                                className="msg-box"
                                style={{
                                  maxWidth:
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                  minWidth:
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                }}
                              >
                                {item?.msg}
                              </span>
                            </Typography>
                          </div>
                        ) : (
                          <div
                            className="msg-reply-container"
                            onMouseEnter={() => {
                              setReply(true);
                              setHoverId(index);
                            }}
                            onMouseLeave={() => {
                              setReply(false);
                              setHoverId("");
                            }}
                            style={{ display: "flex" }}
                          >
                            {" "}
                            <Typography
                              className="usermessage"
                              sx={{
                                maxWidth:
                                  reply && index == hoverId
                                    ? "200px"
                                    : "300px",
                              }}
                            >
                              <span className="from-to-box">
                                {item?.name}
                                {`${item?.name?.slice(0, 10)}...`}
                                {/* from */}
                                {/* <span style={{ color: '#9603F2' }}>{item?.batchName ? item?.batchName : 'All'}</span> to <span style={{ color: '#9603F2' }}>{item?.to !== '' ? item?.to : roomNamesFull?.map(item => item?.roomName)}</span> */}
                              </span>

                              <span
                                className="msg-box"
                                style={{
                                  maxWidth:
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                  minWidth:
                                    reply && index == hoverId
                                      ? "200px"
                                      : "400px",
                                }}
                              >
                                {item?.msg}
                              </span>
                            </Typography>
                            <span
                              className="reply"
                              style={{
                                display:
                                  reply && hoverId == index ? "" : "none",
                              }}
                              onMouseEnter={() => {
                                // setReply(true)
                              }}
                              onMouseLeave={() => {
                                // setReply(false)
                              }}
                              onClick={() => {
                                // setRoomNameOfUser(item.roomName.roomName)
                                setSelectedRoomForMsg({
                                  batch: item?.batchName,
                                  room: item?.room,
                                  userId: item?.socketId,
                                  userName: item?.name,
                                });
                              }}
                            >
                              {" "}
                              Reply <ReplyIcon />
                            </span>
                          </div>
                        )}
                      </Stack>
                    );
                  }
                  // else {
                  //     console.log('came here 3')
                  //     return <Stack>
                  //         {item?.socketId == mySocketId ? <div className="msg-reply-container" style={{ display: 'flex' }}> <Typography onMouseEnter={() => {
                  //             // setReply(true)
                  //         }}
                  //             onMouseLeave={() => {
                  //                 // setReply(false)
                  //             }}
                  //             className="usermessage">
                  //             <span className="from-to-box" style={{}} > {
                  //                 `${item?.name?.slice(0, 10)}...`} from <span style={{ color: '#9603F2' }}>{item?.batchName ? item?.batchName : 'All'}</span> to <span style={{ color: '#9603F2' }}>{item?.to !== '' ? item?.to : roomNames}</span></span>

                  //             <span className='msg-box' style={{ maxWidth: reply && index == hoverId ? '200px' : '300px', minWidth: reply && index == hoverId ? '200px' : '300px' }}>{item?.msg}</span>
                  //         </Typography>

                  //         </div> : <div className="msg-reply-container" onMouseEnter={() => {
                  //             setReply(true)
                  //             setHoverId(index)
                  //         }}
                  //             onMouseLeave={() => {
                  //                 setReply(false)
                  //                 setHoverId('')
                  //             }} style={{ display: 'flex' }}> <Typography
                  //                 className="usermessage"
                  //                 sx={{ maxWidth: reply && index == hoverId ? '200px' : '300px' }}
                  //             >
                  //                 <span className="from-to-box" > {
                  //                     `${item?.name?.slice(0, 10)}...`} from <span style={{ color: '#9603F2' }}>{item?.batchName ? item?.batchName : 'All'}</span> to <span style={{ color: '#9603F2' }}>{item?.to !== '' ? item?.to : roomNames}</span></span>

                  //                 <span className='msg-box' style={{ maxWidth: reply && index == hoverId ? '200px' : '300px', minWidth: reply && index == hoverId ? '200px' : '300px' }}>{item?.msg}</span>
                  //             </Typography>

                  //             <span className="reply" style={{ display: reply && hoverId == index ? '' : 'none' }} onMouseEnter={() => {
                  //                 // setReply(true)
                  //             }}
                  //                 onMouseLeave={() => {
                  //                     // setReply(false)
                  //                 }}
                  //                 onClick={() => {
                  //                     // setRoomNameOfUser(item.roomName.roomName)
                  //                     setSelectedRoomForMsg({ batch: item?.batchName, room: item?.room, userId: item?.socketId, userName: item?.name })
                  //                 }}> Reply <ReplyIcon /></span>
                  //         </div>
                  //         }
                  //     </Stack>
                  // }
                  // <Typography></Typography>
                })
                : "Enter Something..."}
            </Stack>

            <div
              className="to-box"
              style={{ top: userCame && '61vh' }}
              onClick={() => {
                setRoomSelect(true);
              }}
            >
              <span style={{ minWidth: "40px" }}>To :</span>
              <span
                className="to-filter"
                style={{
                  backgroundColor: "#9603F2",
                  color: "white",
                  padding: "3px",
                  borderRadius: "5px",
                }}
              >
                {selectedRoomForMsg?.userName == ""
                  ? `${selectedRoomForMsg?.batch !== ""
                    ? selectedRoomForMsg?.batch
                    : "All"
                  }${selectedRoomForMsg?.displayName !== ""
                    ? `>${(selectedRoomForMsg?.displayName).toString()}`
                    : ""
                  }`
                  : selectedRoomForMsg?.userName}
              </span>

              {roomSelect && (
                <div className="room-select-container">
                  <ul>
                    <li className="">Select Batch</li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomSelect(false);
                        setSelectedRoomForMsg({
                          batch: batchNames,
                          room: roomNames,
                          displayName: roomNamesFull?.map(
                            (item) => item?.roomName
                          ),
                          userName: "",
                        });
                      }}
                    >
                      All
                    </li>
                    {batchNames?.length > 0 &&
                      batchNames?.map((item, index) => {
                        return (
                          <div style={{ display: "flex" }}>
                            <li
                              className="batch-select"
                              onClick={() =>
                                setSelectedRoomForMsg({
                                  batch: item,
                                  room: roomNames,
                                  userName: "",
                                  displayName: roomNamesFull?.map(
                                    (item) => item?.roomName
                                  ),
                                })
                              }
                            >
                              <span>{item}</span>{" "}
                              <>
                                {roomNames?.length > 0 ? (
                                  <ArrowDropDownIcon
                                    onClick={() => {
                                      setRoomList(true);
                                    }}
                                  />
                                ) : (
                                  <ArrowDropUpIcon
                                    onClick={() => {
                                      setRoomList(false);
                                    }}
                                  />
                                )}
                              </>
                            </li>
                          </div>
                        );
                      })}
                  </ul>
                </div>
              )}
              {roomList && (
                <div className="room-select-container-room">
                  <ul>
                    <li className="">Select Room</li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomSelect(false);
                        setRoomList(false);
                        setSelectedRoomForMsg((prev) => ({
                          ...prev,
                          room: roomNames,
                          userName: "",
                          displayName: roomNamesFull?.map(
                            (item) => item?.roomName
                          ),
                        }));
                      }}
                    >
                      All
                    </li>
                    {roomNamesFull?.length > 0 &&
                      roomNamesFull?.map((item, index) => {
                        return (
                          <div
                            style={{ display: "flex" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setRoomSelect(false);
                              setSelectedRoomForMsg((prev) => ({
                                ...prev,
                                room: [item?.roomId],
                                displayName: [item?.roomName],
                                userName: "",
                              }));
                              setRoomList(false);
                            }}
                          >
                            <li className="batch-select">
                              <span>{item?.roomName}</span>{" "}
                            </li>
                          </div>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
            <div
              className="input_box"
              style={{
                borderRadius: "10px",
                position: "absolute",
                top: "58vh",
              }}
            >
              <input
                type="text"
                value={msg}
                placeholder="Send a message..."
                onChange={handleSendMessage}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    handleSend();
                  }
                }}
              />
              <div className="input_box_icons">
                <div>
                  {" "}
                  <MdOutlineEmojiEmotions />
                </div>
                <div onClick={handleSend}>
                  {" "}
                  <LuSendHorizonal />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>

  );
};

export default ChatContainer;
