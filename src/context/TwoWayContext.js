
import { createContext, useState } from "react";
import socket from "../socket/socket";
import avatar from '../assets/avatar.jpg'
import toast from "react-hot-toast";

export const TwoWayData = createContext();

export const TwoWayContext = ({ children }) => {
    const teacherName = localStorage.getItem("teacher-name");
    const name = teacherName ? teacherName : "Teacher";



    const [showChat, setShowChat] = useState(true);
    const [showParticipants, setShowParticipants] = useState(false);
    const [msgList, setMsgList] = useState([]);
    const [participantsListOfUser, setParticipantsListOfUser] = useState([]);
    const [onlyProducer, setOnlyProducer] = useState(true);
    const [roomsFromPanel, setRoomsFromPanel] = useState([]);
    const [roomsFromPanelFullDetails, setRoomsFromPanelFullDetails] = useState(
        []
    );
    const [batchesFromPanel, setBatchesFromPanel] = useState([]);
    const [lectureFromPanel, setLectureFromPanel] = useState([]);
    const [lectureData, setLectureData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);

    const [remoteProducerIdForPip, setRemoteProucerId] = useState("");

    const [pollDisplay, setPollDisplay] = useState(false);
    const [doubtDisplay, setDoubtDisplay] = useState(false);
    const [infoDisplay, setInfoDisplay] = useState(false);
    const [confirmDisplay, setConfirmDisplay] = useState(false);
    const [resourceDisplay, setResourceDisplay] = useState(false);


    const [isMicOn, setIsMicOn] = useState(false);
    const [isMicOnUser, setIsMicOnUser] = useState(false);


    const [enableDoubts, setEnableDoubts] = useState(false);
    const [footerShow, setFooterShow] = useState(false);
    const [pinFooter, setPinFooter] = useState(false);


    const [videoProducerId, setVideoProducerId] = useState("");
    const [audioProducerId, setAudioProducerId] = useState("");


    const [permissionResponseModal, setPermissionResponseModal] = useState(false);

    const [allReq, setAllReq] = useState([]);

    const [userDetails, setUserDetails] = useState();

    //Get Lecture
    const getLecture = async (roomName) => {
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNkY2FtcHVzQHRyYW5kby5pbiIsInN0dWRlbnRJZCI6IjNjZjcwODYwLTZjMWMtMTFlZC04YjVlLWMxZjc4OTdkMzM5OCIsImFjY2Vzc09iaiI6eyJkZWxldGVBY2Nlc3MiOmZhbHNlLCJhY2Nlc3NGb3JUYWIiOiJyZWFkIiwiYWNjZXNzIjpbImFsbCJdLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGhvdG8iOiJodHRwczovL3N0b3JhZ2UtdXBzY2hpbmRpLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9kYXRhL2ltYWdlcy9hdmF0YXIucG5nIiwidXNlcm5hbWUiOiJTRCBDYW1wdXMiLCJtb2JpbGVObyI6OTk4MzkwNDM5N30sImlhdCI6MTcxMTAxMjk4NywiZXhwIjoxNzExMDk5Mzg3fQ.0WoT'
        const token = localStorage.getItem("token");
        const config = {};

        const fullResponse = await fetch(
            // `http://localhost:3001/api/v1/adminPanel/getLectureByName?commonName=${roomName}`,
            // `https://stage-backend.sdcampus.com/api/v1/adminPanel/getLectureByName?commonName=${roomName}`,
            `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getLectureByName?commonName=${roomName}`,
            // `${process.env.REACT_APP_PRODUCTION_LIVE_URL}/adminPanel/getLectureByName?commonName=Today 06-04/*/06-04-2024 10:55:58`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            }
        );
        const responseJson = await fullResponse.json();

        setLectureData(responseJson?.data);

        let helperBatch = [];
        let helperLecture = [];
        let helperRoom = [];
        let helperRoomFullDetails = [];
        responseJson?.data?.map((item) => {
            item.rooms?.map((roomItem) => {
                helperRoom.push(roomItem?.roomId);
            });
            item.rooms?.map((roomItem) => {
                helperRoomFullDetails.push(roomItem);
            });
            helperBatch.push({
                batchId: item?.batchId,
                batchName: item?.batchName,
            });
            helperLecture.push({
                lectureId: item?.lectureId,
                lectureTitle: item?.lectureTitle,
            });
        });
        setRoomsFromPanel(helperRoom);
        setRoomsFromPanelFullDetails(helperRoomFullDetails);
        setLectureFromPanel(helperLecture);
        setBatchesFromPanel(helperBatch);
        setLoading(true);
    };


    //doubts
    const getAllDoubts = () => {
        let helper = [];
        lectureFromPanel?.map((item) => helper.push(item?.lectureId));
        // console.log('Lecture doubts', helper)
        socket.emit(
            "getAllDoubts",
            {
                lectureIds: helper,
            },
            (data) => {
                // console.log('Douts', data)
            }
        );
    };


    //sendMessage (socket)
    const sendMessage = (info) => {
        let roomName = localStorage.getItem('roomName')
        console.log("send-message",
            { ...info, id: socket.id, roomName },
            (data) => { })
        socket.emit(
            "send-message",
            { ...info, id: socket.id, roomName },
            (data) => { }
        );
    };



    //hideCam
    function hideCam() {
        // console.log('videoProducer id', videoProducerId)
        const videoTrack = document
            .getElementById("localVideo")
            .srcObject.getTracks()
            .find((track) => track.kind === "video");
        videoTrack.enabled = false;

        socket.emit("producer-paused", {
            videoProducerId: videoProducerId,
            videoStatus: false,
        });
        document.getElementById("localVideo").style.display = "none";
        const localVideoContainer = document.getElementById("localVideoContainer");
        const newElem = document.createElement("div");
        const img = document.createElement("img");
        // img.setAttribute('id', 'localVideoThumbnail')
        newElem.innerHTML = `<div style="display:"flex";flex-direction:"column";"><img src=${avatar} height="200" width="200" style="border-radius:50%;"/>
        <p>${name}</p>
        </div>`;
        newElem.setAttribute("id", "localVideoThumbnail");
        newElem.style.width = "90%";
        newElem.style.marginLeft = "5%";
        newElem.style.marginTop = "-5px";
        newElem.style.height = "80vh";
        newElem.style.display = "flex";
        newElem.style.background = "black";
        newElem.style.justifyContent = "center";
        newElem.style.alignItems = "center";
        newElem.style.color = "white";
        newElem.style.borderRadius = "10px";
        newElem.style.marginTop = "2rem";
        // newElem.innerText = name
        // img.src = thumbnail

        localVideoContainer.appendChild(newElem);
        // socket.emit('producer-pause')
        // producerTransport.paus
        // socket.emit('transport-pause')
    }




    function stopAudio() {
        // socket.emit('producer-paused', ({ audioProducerId: audioProducerId, audioStatus: false }))
        const audioTrack = document
            .getElementById("localVideo")
            .srcObject.getTracks()
            .find((track) => track.kind === "audio");
        audioTrack.enabled = false;
    }
    function playAudio() {
        // socket.emit('producer-paused', ({ audioProducerId: audioProducerId, audioStatus: true }))
        const audioTrack = document
            .getElementById("localVideo")
            .srcObject.getTracks()
            .find((track) => track.kind === "audio");
        audioTrack.enabled = true;
    }



    function showCam() {
        const videoTrack = document
            .getElementById("localVideo")
            .srcObject.getTracks()
            .find((track) => track.kind === "video");
        videoTrack.enabled = true;

        socket.emit("producer-paused", {
            videoProducerId: videoProducerId,
            videoStatus: true,
        });
        const localVideoContainer = document.getElementById("localVideoContainer");
        localVideoContainer.removeChild(
            document.getElementById("localVideoThumbnail")
        );

        document.getElementById("localVideo").style.display = "";
        // videoProducer.resume()
        // console.log('VIDEO PRODUCER RESUME', videoProducer)
        socket.emit("producer-resume");
    }




    const answerForPermission = (answer, item) => {
        // console.log('answer', answer)
        if (answer) {
            toast.success("Request Accepted!! Waiting for user...");
            setPermissionResponseModal(false);
        } else {
            toast.error("Request Denied!!");
            setPermissionResponseModal(false);
        }
        // setPermissionResponse(answer)
        // setUserDetails((prev) => ({ ...prev, status: answer }))

        const data = {
            for: item?.for,
            name: item?.name,
            status: answer,
            userId: item?.userId,
        };
        socket.emit("answer-to-request", data);
    };





    const updatePermission = (id, action) => {
        socket.emit(
            "permission-updated",
            { id, action, roomName: roomsFromPanel },
            (data) => {
                // console.log('permission-updated', data)
                setAllReq(data);
            }
        );
    };



    const [isScreenShared, setIsScreenShared] = useState(false);
    const [answerGiven, setAnswerGiven] = useState(false);




    let contextData = {
        showChat,
        setShowChat,
        showParticipants,
        setShowParticipants,
        msgList,
        setMsgList,
        participantsListOfUser,
        setParticipantsListOfUser,
        onlyProducer,
        setOnlyProducer,
        roomsFromPanel,
        setRoomsFromPanel,
        roomsFromPanelFullDetails,
        setRoomsFromPanelFullDetails,
        batchesFromPanel,
        setBatchesFromPanel,
        lectureFromPanel,
        setLectureFromPanel,
        lectureData,
        setLectureData,
        loading,
        setLoading,
        getLecture,
        isCameraOn,
        setIsCameraOn,
        remoteProducerIdForPip,
        setRemoteProucerId,
        pollDisplay,
        setPollDisplay,
        doubtDisplay,
        setDoubtDisplay,
        infoDisplay,
        setInfoDisplay,
        confirmDisplay,
        setConfirmDisplay,
        resourceDisplay,
        setResourceDisplay,
        isMicOn,
        setIsMicOn,
        isMicOnUser,
        setIsMicOnUser,
        sendMessage,
        enableDoubts,
        setEnableDoubts,
        footerShow,
        setFooterShow,
        pinFooter,
        setPinFooter,
        showCam,
        hideCam,
        playAudio,
        stopAudio,

        isScreenShared,
        setIsScreenShared,
        answerGiven,
        setAnswerGiven,

        videoProducerId,
        setVideoProducerId,
        audioProducerId,
        setAudioProducerId,

        permissionResponseModal,
        setPermissionResponseModal,

        allReq,
        setAllReq,
        userDetails,
        setUserDetails,
        answerForPermission,
        updatePermission,
        getAllDoubts,






    }
    return <TwoWayData.Provider value={contextData}>{children}</TwoWayData.Provider>
}