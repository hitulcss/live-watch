import React, { useContext, useEffect, useState } from 'react'
import ChatContainer from '../../components/chat/ChatContainer'
import { TwoWayData } from '../../context/TwoWayContext'
import socket from '../../socket/socket'
import { useParams } from 'react-router-dom'
import Footer from '../../components/footer/Footer'
import './ChatPage.css'
import Resources from '../../components/resources/Resources';
import Doubts from '../../components/doubts/Doubts'
import Confirmation from '../../components/confirmationmodal/Confirmation'
import PollContainer from '../../components/poll/PollContainer'
import Info from '../../components/info/Info'
import Draggable from 'react-draggable'
//Imports
import { Device } from "mediasoup-client";
import "../../Medisoup/Mediasoup.css";
import { onDoubleClickHandler } from '../../utils/UIFuntions'








const ChatPage = () => {


    const [userCame, setUserCame] = useState(false)

    localStorage.setItem('chatPage', 'mod')
    let chatPage = 'mod'

    //context data
    const {
        showChat,
        setShowChat,
        showParticipants,
        setShowParticipants,
        msgList,
        setMsgList,
        participantsListOfUser,
        setParticipantsListOfUser,

        setOnlyProducer,
        sendMessage,

        batchesFromPanel,
        roomsFromPanel,
        roomsFromPanelFullDetails,
        setIsMicOnUser,
        isMicOnUser,
        audioPause,
        audioResume,

        lectureFromPanel,

        lectureData,

        loading,

        isMicOn,
        setIsMicOn,
        getLecture,
        isCameraOn,
        setIsCameraOn,



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


        permissionResponseModal,
        setPermissionResponseModal,

        allReq,
        setAllReq,


        setUserDetails,

        answerForPermission,
        updatePermission,

        getAllDoubts,





    } = useContext(TwoWayData)




    useEffect(() => {
        socket.on("permission-admin-to-user", (data) => {
            // console.log('Data', data)
        });

        socket.on("response-admin-to-user", (data) => {
            // console.log(data)
        });
    }, []);
    socket.on("admin-response-to-request", (data) => {
        // toast.success('Someone is asking for permission to connect through video....')
        setUserDetails({ ...data });
        setAllReq(data);
        setPermissionResponseModal(true);

        // callback({ data })
    });


    //role
    const role = JSON.parse(localStorage.getItem("details"))?.role;
    //roomname
    const { roomName2, date } = useParams();
    let roomname3 = "";
    for (let i = 0; i < roomName2.length; i++) {
        // console.log(item?.commonName[i]);
        if (roomName2[i] == "-") {
            roomname3 = roomname3 + " ";
        } else {
            roomname3 = roomname3 + roomName2[i];
        }
    }

    let roomName = roomName2;
    localStorage.setItem('roomName', roomName)



    const teacherName = localStorage.getItem("teacher-name");
    const name = teacherName ? teacherName : "Teacher";





    socket.on("participants", (data) => {
        // console.log('HItttt', data)

        setParticipantsListOfUser(data);
        // socket.emit('doubtStatus', { status: enableDoubts, roomName: roomsFromPanel, lectureIds: lectureFromPanel }, (data) => {
        //     // console.log("doubtStatus" + data);

        // })
    });


    useEffect(() => {
        // window.location.reload()
        socket.emit("chat-room", "room");
        // socket.on('recieve-message', (data) => {
        //     setMsgList((prev) => [...prev, data])
        // })

        // socket.on("users-status", (data) => {
        //     changeUserStatus(data);
        // });
        // socket.on('test', () => { console.log('Tessssting') })
    }, []);





    let mySocketId = socket.id;
    useEffect(() => {
        if (roomName) { getLecture(roomName) }
    }, [roomName]);

    useEffect(() => {
        console.log('came')
        localStorage.setItem('chat-redirected', true);


    }, [])

    const {
        isScreenShared,
        setIsScreenShared,
        answerGiven,
        setAnswerGiven,

        videoProducerId,
        setVideoProducerId,
        audioProducerId,
        setAudioProducerId,





    } = useContext(TwoWayData)


    //refersh confirmation
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            localStorage.setItem('chat-redirected', false);

            // Custom logic to handle the refresh
            // Display a confirmation message or perform necessary actions
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    useEffect(() => {
        const handleunload = (event) => {
            event.preventDefault();
            localStorage.setItem('chat-redirected', false);

            // Custom logic to handle the refresh
            // Display a confirmation message or perform necessary actions
        };
        window.addEventListener("unload", handleunload);
        return () => {
            window.removeEventListener("unload", handleunload);
        };
    }, []);





    const batch = "Batch";
    const mentor = "Mentor";


    useEffect(() => {
        if (roomName) { getLecture(roomName) }
    }, [roomName]);


    const batchNames = batch.split(",");
    const roomNames = roomName?.split(",");

    let videoContainer;
    let device;
    let rtpCapabilities;
    let producerTransport;
    let consumerTransports = [];
    let audioProducer;
    let videoProducer;
    let screenShare;

    let consumer;
    let isProducer = false;

    let localVideo;
    let streamOfUser;

    let params = {
        kind: "video",
        rtpParameters: {
            mid: "1",
            codecs: [
                {
                    mimeType: "video/VP8",
                    payloadType: 101,
                    clockRate: 90000,
                    rtcpFeedback: [
                        { type: "nack" },
                        { type: "nack", parameter: "pli" },
                        { type: "ccm", parameter: "fir" },
                        { type: "goog-remb" },
                    ],
                },
                {
                    mimeType: "video/rtx",
                    payloadType: 102,
                    clockRate: 90000,
                    parameters: { apt: 101 },
                },
            ],
            headerExtensions: [
                {
                    id: 2,
                    uri: "urn:ietf:params:rtp-hdrext:sdes:mid",
                },
                {
                    id: 3,
                    uri: "urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id",
                },
                {
                    id: 5,
                    uri: "urn:3gpp:video-orientation",
                },
                {
                    id: 6,
                    uri: "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",
                },
            ],
            encodings: [
                { rid: "r0", active: true, maxBitrate: 100000 },
                { rid: "r1", active: true, maxBitrate: 300000 },
                { rid: "r2", active: true, maxBitrate: 900000 },
            ],
            rtcp: {
                cname: "Zjhd656aqfoo",
            },
        },
    };
    let audioParams;
    let videoParams = { params };
    let screenShareParams = { params };
    let consumingTransports = [];

    useEffect(() => {
        socket.on("connection-success", ({ socketId }) => { });

        if (loading) getLocalStream();
    }, [loading]);

    const streamSuccess = (stream) => {
        if (role == "moderator" || chatPage == 'mod') {
            joinRoom();
        } else {
            streamOfUser = stream;
            localVideo = document.getElementById("localVideo").srcObject = stream;

            localVideo.srcObject = stream;

            audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
            videoParams = { track: stream.getVideoTracks()[0], ...videoParams };
            stopAudio();
            joinRoom();
        }
    };

    const joinRoom = () => {

        socket.emit(
            "joinRoom",
            {
                roomName: roomsFromPanel,
                lectureId: lectureFromPanel[0]?.lectureId,
                lectures: lectureFromPanel,
                lectureTitle: lectureFromPanel[0]?.lectureTitle,
                batch: batchNames,
                mentor: mentor,
                role: "Admin",
                name: name,
                // isAdmin: (role == "moderator" || chatPage == 'mod') ? false : true,
                isAdmin: true,
                adminId: socket.id,
            },
            (data) => {
                // we assign to local variable and will be used when
                // loading the client Device (see createDevice above)
                rtpCapabilities = data.rtpCapabilities;
                // once we have rtpCapabilities from the Router, create Device
                createDevice();
            }
        );
    };

    const createDevice = async () => {
        try {
            device = new Device();

            // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
            // Loads the device with RTP capabilities of the Router (server side)
            await device.load({
                // see getRtpCapabilities() below
                routerRtpCapabilities: rtpCapabilities,
            });

            // once the device loads, create transport

            if (role !== "moderator" && chatPage !== 'mod') {
                createSendTransport();
            } else if (chatPage == 'mod') {
                console.log('line 480')
                getProducers();

            }

        } catch (error) {
            console.log(error);
            if (error.name === "UnsupportedError")
                console.warn("browser not supported");
        }
    };

    const getLocalStream = () => {
        // console.log('coming here')
        if (role == "moderator" || chatPage == 'mod') {
            joinRoom();
            // console.log('hello')
        } else {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                    video: {
                        aspectRatio: 1.77777777778,
                    },
                })
                .then(streamSuccess)
                .catch((error) => {
                    console.log("stream error   ");
                });
        }
    };
    // console.log(navigator.mediaDevices.)
    // const localVideo = useRef();

    const createSendTransport = () => {
        // see server's socket.on('createWebRtcTransport', sender?, ...)
        // this is a call from Producer, so sender = true
        socket.emit(
            "createWebRtcTransport",
            { consumer: false },
            async ({ params }) => {
                // The server sends back params needed
                // to create Send Transport on the client side
                if (params.error) {
                    console.log(params.error);
                    return;
                }

                // creates a new WebRTC Transport to send media
                // based on the server's producer transport params
                // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions

                producerTransport = device.createSendTransport(params);

                // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
                // this event is raised when a first call to transport.produce() is made
                // see connectSendTransport() below
                producerTransport.on(
                    "connect",
                    async ({ dtlsParameters }, callback, errback) => {
                        try {
                            socket.emit("transport-connect", {
                                dtlsParameters,
                            });

                            // Tell the transport that parameters were transmitted.
                            callback();
                        } catch (error) {
                            errback(error);
                        }
                    }
                );

                producerTransport.on(
                    "produce",
                    async (parameters, callback, errback) => {
                        try {
                            // tell the server to create a Producer
                            // with the following parameters and produce
                            // and expect back a server side producer id
                            // see server's socket.on('transport-produce', ...)
                            await socket.emit(
                                "transport-produce",
                                {
                                    kind: parameters.kind,
                                    rtpParameters: parameters.rtpParameters,
                                    appData: parameters.appData,
                                },
                                ({ id, producersExist }) => {
                                    // Tell the transport that parameters were transmitted and provide it with the
                                    // server side producer's id.
                                    callback({ id });

                                    // if producers exist, then join room
                                    // console.log('pproducer,exist', producersExist)
                                    if (producersExist) {
                                        setOnlyProducer(false);
                                        getProducers();
                                    } else {
                                        setOnlyProducer(true);
                                    }
                                }
                            );
                        } catch (error) {
                            errback(error);
                        }
                    }
                );

                connectSendTransport();
            }
        );
    };



    const connectSendTransport = async () => {
        // we now call produce() to instruct the producer transport
        // to send media to the Router
        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
        // this action will trigger the 'connect' and 'produce' events above

        audioProducer = await producerTransport?.produce(audioParams);
        // console.log('Video Params', videoParams)
        videoProducer = await producerTransport?.produce(videoParams);
        setVideoProducerId(videoProducer.id);
        setAudioProducerId(audioProducer.id);
        // console.log('Produced VideoPro', videoProducer)
        audioProducer.on("trackended", () => {
            console.log("audio track ended");

            // close audio track
        });

        audioProducer.on("transportclose", () => {
            console.log("audio transport ended");

            // close audio track
        });

        videoProducer.observer.on("pause", () => { });
        videoProducer.on("trackended", () => {
            console.log("video track ended");

            // close video track
        });

        videoProducer.on("transportclose", () => {
            console.log("video transport ended");

            // close video track
        });
        videoProducer.on("paused", () => {
            // console.log('PAUSEDDD')
        });
    };


    const signalNewConsumerTransport = async (remoteProducerId) => {
        //check if we are already consuming the remoteProducerId
        // console.log('remoteProducerId', remoteProducerId)

        if (consumingTransports.includes(remoteProducerId)) return;
        consumingTransports.push(remoteProducerId);

        await socket.emit(
            "createWebRtcTransport",
            { consumer: true },
            ({ params }) => {
                // The server sends back params needed
                // to create Send Transport on the client side
                // console.log('DEVICE', device.sctpCapabilities)
                if (params.error) {
                    console.log(params.error);
                    return;
                }
                // console.log(`PARAMS... ${params}`)

                let consumerTransport;
                if (device) {
                    try {
                        consumerTransport = device.createRecvTransport(params);
                    } catch (error) {
                        // exceptions:
                        // {InvalidStateError} if not loaded
                        // {TypeError} if wrong arguments.
                        console.log(error);
                        return;
                    }

                    consumerTransport.on(
                        "connect",
                        async ({ dtlsParameters }, callback, errback) => {
                            try {
                                // Signal local DTLS parameters to the server side transport
                                // see server's socket.on('transport-recv-connect', ...)
                                await socket.emit("transport-recv-connect", {
                                    dtlsParameters,
                                    serverConsumerTransportId: params.id,
                                });
                                setOnlyProducer(false);
                                // Tell the transport that parameters were transmitted.
                                callback();
                            } catch (error) {
                                setOnlyProducer(true);
                                // Tell the transport that something was wrong
                                errback(error);
                            }
                        }
                    );

                    connectRecvTransport(consumerTransport, remoteProducerId, params.id);
                } else {
                    console.log("device not ready");
                }
            }
        );
    };

    // server informs the client of a new producer just joined
    socket.on(
        "new-producer",
        ({ producerId, socketId, name, isAdmin, selfVideo }) => {
            console.log('new-producer', producerId, socketId, name, isAdmin, selfVideo)
            if (!selfVideo && !isAdmin) {

                setUserCame(true)
                signalNewConsumerTransport(producerId);
            }
        }
    );

    const getProducers = () => {
        socket.emit("getProducers", { data: "" }, (producerIds) => {
            console.log('producerIds', producerIds)
            // for each of the producer create a consumer
            // producerIds.forEach(id => signalNewConsumerTransport(id))

            producerIds?.forEach((id) => signalNewConsumerTransport(id.producer));
        });
    };

    const connectRecvTransport = async (
        consumerTransport,
        remoteProducerId,
        serverConsumerTransportId
    ) => {
        // for consumer, we need to tell the server first
        // to create a consumer based on the rtpCapabilities and consume
        // if the router can consume, it will send back a set of params as below
        // console.log('Remote Producer Id', remoteProducerId)
        // const data = { producerId: remoteProducerId }
        // console.log('line327', data)
        await socket.emit(
            "consume",
            {
                rtpCapabilities: device.rtpCapabilities,
                remoteProducerId,
                // remoteProducerId: {
                //     ...data
                // },
                serverConsumerTransportId,
            },
            async ({ params }) => {
                if (params.error) {
                    console.log("Cannot Consume");
                    return;
                }



                // then consume with the local consumer transport
                // which creates a consumer
                const consumer = await consumerTransport.consume({
                    id: params.id,
                    producerId: params.producerId,
                    kind: params.kind,
                    rtpParameters: params.rtpParameters,
                });
                consumer.on("producerpause", () => {
                    console.log("front end paused");
                });
                consumer.observer.on("pause", () => {
                    console.log("front end paused");
                });

                consumerTransports = [
                    ...consumerTransports,
                    {
                        consumerTransport,
                        serverConsumerTransportId: params.id,
                        producerId: remoteProducerId,
                        consumer,
                    },
                ];

                // console.log('remodte producer id', remoteProducerId)
                // console.log('consumer producer id', consumer)
                // create a new div element for the new consumer media

                const newElem = document.createElement("div");
                newElem.style.position = "relative";
                const host = document.createElement("h5");
                const pip = document.createElement("button");
                const remove = document.createElement("div");
                const imgIcon = document.createElement("img");
                imgIcon.setAttribute(
                    "src",
                    "https://d1mbj426mo5twu.cloudfront.net/AIR/call_end (1)_1715344962.png"
                );
                imgIcon.style.height = "30px";
                imgIcon.style.width = "30px";
                imgIcon.style.cursor = "pointer";
                // imgIcon.setAttribute('width', '50px')
                imgIcon.style.position = "absolute";
                imgIcon.style.bottom = "50px";
                imgIcon.style.left = "45%";
                const icon =
                    // const username = document.createElement('h5')

                    newElem.setAttribute("id", `td-${remoteProducerId}`);

                setRemoteProucerId(remoteProducerId);
                if (params.kind == "audio" && !params?.isAdmin) {
                    if (role == "moderator" || chatPage == 'mod') {
                        videoContainer = document.getElementById("videoContainer");

                    } else {
                        videoContainer = document.getElementById("videoContainer");
                    }
                    //append to the audio container
                    newElem.innerHTML =
                        '<audio id="' + remoteProducerId + '" autoplay></audio>';
                } else {
                    //append to the video container
                    newElem.setAttribute("class", "remoteVideo");
                    // newElem.addEventListener('click', handleClick(remoteProducerId))
                    if (params.isAdmin) {
                        if (role == "moderator" || chatPage == 'mod') {
                            videoContainer = document.getElementById("videoContainer-host");
                            newElem.innerHTML = '<div></div>'
                            // '<video id = "' +
                            //     remoteProducerId +
                            //     '" autoplay class="video-host" ></video>';
                        } else {
                            videoContainer = document.getElementById("videoContainer");
                            newElem.innerHTML =
                                '<video id = "' +
                                remoteProducerId +
                                '" autoplay class="video" ></video>';
                        }
                        host.innerText = "Host";
                        // host.innerText = params.name
                        host.style.position = "absolute";
                        host.style.color = "#ffffff8f";
                        host.style.top = "30px";
                        host.style.right = "70px";
                        host.style.background = "#80808073";
                        // host.style.padding = '2px 5px'
                        host.style.borderRadius = "5px";

                        pip.innerText = "Pip";
                        remove.innerText = "remove";
                        pip.style.position = "absolute";
                        remove.style.top = "70px";
                        pip.style.top = "30px";
                        pip.style.right = "20px";
                        pip.style.cursor = "pointer";
                        pip.style.border = "none";
                        pip.style.background = "lightgray";
                        pip.style.borderRadius = "5px";
                        pip.style.fontSize = "15px";

                        // newElem.appendChild(host);
                        // newElem.appendChild(pip);
                        // newElem.appendChild(remove)
                    } else {
                        videoContainer = document.getElementById("videoContainer");
                        if (role == "moderator" || chatPage == 'mod') {
                            newElem.innerHTML =
                                '<video id = "' +
                                remoteProducerId +
                                '" autoplay class="video-user" ></video>';
                            host.innerText = params.name;
                            host.style.position = "absolute";
                            host.style.color = "#ffffff8f";
                            host.style.top = "30px";
                            host.style.right = "70px";
                            host.style.background = "#80808073";
                            // host.style.padding = '2px 5px'
                            host.style.borderRadius = "5px";

                            pip.innerText = "Pip";
                            remove.innerText = "remove";
                            pip.style.position = "absolute";
                            remove.style.top = "70px";
                            pip.style.top = "30px";
                            pip.style.right = "20px";
                            pip.style.cursor = "pointer";
                            pip.style.border = "none";
                            pip.style.background = "lightgray";
                            pip.style.borderRadius = "5px";
                            pip.style.fontSize = "15px";

                            newElem.appendChild(host);
                            newElem.appendChild(pip);
                            // newElem.appendChild(remove)
                            newElem.appendChild(imgIcon);
                        } else {
                            newElem.innerHTML =
                                '<video id = "' +
                                remoteProducerId +
                                '" autoplay class="video-user" ></video>';
                            host.innerText = params.name;
                            host.style.position = "absolute";
                            host.style.color = "#ffffff8f";
                            host.style.top = "30px";
                            host.style.right = "70px";
                            host.style.background = "#80808073";
                            // host.style.padding = '2px 5px'
                            host.style.borderRadius = "5px";

                            pip.innerText = "Pip";
                            remove.innerText = "remove";
                            pip.style.position = "absolute";
                            remove.style.top = "70px";
                            pip.style.top = "30px";
                            pip.style.right = "20px";
                            pip.style.cursor = "pointer";
                            pip.style.border = "none";
                            pip.style.background = "lightgray";
                            pip.style.borderRadius = "5px";
                            pip.style.fontSize = "15px";

                            newElem.appendChild(host);
                            newElem.appendChild(pip);
                            // newElem.appendChild(remove)
                            newElem.appendChild(imgIcon);
                        }
                    }
                }


                videoContainer.appendChild(newElem);
                // Make the DIV element draggable:
                // dragElement(document.getElementById(remoteProducerId));
                // videoContainer.appendChild(host)

                // destructure and retrieve the video track from the producer
                // console.log('Producer consuner', consumer)
                const { track } = consumer;

                // console.log('producer Track', track)
                pip.addEventListener("click", () => {
                    handleClick(remoteProducerId);
                });
                imgIcon.addEventListener("click", () => {
                    handleCloseProduce(params?.socketIdOfUser);
                });
                // document.getElementById(remoteProducerId).style.width = "1200px";
                if (document.getElementById(remoteProducerId)) {

                    document.getElementById(remoteProducerId).srcObject = new MediaStream([
                        track,
                    ]);
                }
                // the server consumer started with media paused
                // so we need to inform the server to resume
                socket.emit("consumer-resume", {
                    serverConsumerId: params.serverConsumerId,
                });
            }
        );
    };

    socket.on("producer-closed", ({ remoteProducerId }) => {
        console.log("came here", remoteProducerId);
        // server notification is received when a producer is closed
        // we need to close the client-side consumer and associated transport
        // console.log('consumer Transports', consumerTransports)
        // console.log('consumer Transports remoteProducerId', remoteProducerId)
        if (consumerTransports.length !== 0) {
            const producerToClose = consumerTransports.find(
                (transportData) => transportData.producerId === remoteProducerId
            );
            producerToClose.consumerTransport.close();
            producerToClose.consumer.close();
            setOnlyProducer(false);

            // remove the consumer transport from the list
            consumerTransports = consumerTransports.filter(
                (transportData) => transportData.producerId !== remoteProducerId
            );

            // remove the video div element


            setUserCame(false)
            if (document.getElementById(`td-${remoteProducerId}`)) {
                console.log(document.getElementById(`td-${remoteProducerId}`))
                videoContainer?.removeChild(
                    document.getElementById(`td-${remoteProducerId}`)
                );
            }
        } else {
            setOnlyProducer(true);
            console.log("no consmers to close");
        }
    });

    //UI


    useEffect(() => {
        // window.location.reload()
        socket.emit("chat-room", "room");
        // socket.on('recieve-message', (data) => {
        //     setMsgList((prev) => [...prev, data])
        // })
        socket.on("recieve-message-for-admin", (data) => {
            console.log('coming dtaa', data)
            setMsgList((prev) => [...prev, data]);
        });
        socket.on("users-status", (data) => {
            changeUserStatus(data);
        });
        // socket.on('test', () => { console.log('Tessssting') })
    }, []);
    socket.on("participants", (data) => {
        // console.log('HItttt', data)

        setParticipantsListOfUser(data);
        // socket.emit('doubtStatus', { status: enableDoubts, roomName: roomsFromPanel, lectureIds: lectureFromPanel }, (data) => {
        //     // console.log("doubtStatus" + data);

        // })
    });
    socket.on("doubt-session", (data) => { });




    const changeUserStatus = (data) => {
        const videoContainer = document.getElementById("videoContainer");
        // console.log('data in user status', data)

        if (!data.videoStatus && data.videoProducerId !== videoProducerId) {
            const helper = document.getElementById(`td-${data.videoProducerId}`);
            // console.log('helper', helper)
            if (helper) {
                helper.style.display = "none";

                const newElem = document.createElement("div");
                // newElem.innerHTML = '<audio id="' + remoteProducerId + '" autoplay></audio>'
                newElem.setAttribute("id", `td-${data.videoProducerId}-td`);
                newElem.style.width = "1200px";
                newElem.style.height = "60vh";
                newElem.style.display = "flex";
                newElem.style.background = "black";
                newElem.style.justifyContent = "center";
                newElem.style.alignItems = "center";
                newElem.style.color = "white";

                newElem.style.borderRadius = "10px";
                newElem.innerText = "User";

                videoContainer.appendChild(newElem);
            } else {
            }
        }
        if (data.videoStatus && data.videoProducerId !== videoProducerId) {
            const helper = document.getElementById(`td-${data.videoProducerId}-td`);
            // console.log('helper', helper)
            if (helper) {
                helper.style.display = "none";
                document.getElementById(`td-${data.videoProducerId}`).style.display =
                    "";
            } else {
            }
        }
    };



    // console.log(document.getElementById('videoContainer'))

    const connectSendScreenTransport = async () => {
        // console.log('Screen share producer', producerTransport)
        screenShare = await producerTransport.produce(screenShareParams);

        screenShare.on("trackended", () => {
            console.log("screenShare track ended");

            // close screenShare track
        });

        screenShare.on("transportclose", () => {
            console.log("screenShare transport ended");

            // close video track
        });
    };

    async function startCapture(displayMediaOptions) {
        // hideCam()
        // const videoTrack = document.getElementById('localVideo').getTracks().find(track => track.kind === 'video');
        // videoTrack.enabled = false;
        let captureStream = null;

        try {
            captureStream = await navigator.mediaDevices.getDisplayMedia(
                displayMediaOptions
            );
        } catch (err) {
            console.error(`Error: ${err}`);
        }

        if (captureStream) {
            setIsScreenShared(true);
            document.getElementById("screenSharing").srcObject = captureStream;
            screenShareParams = {
                track: captureStream.getVideoTracks()[0],
                ...screenShareParams,
            };
            connectSendScreenTransport();
        } else {
            setIsScreenShared(false);
            // console.log("Not Shared")
        }
    }

    function stopCapture(evt) {
        // console.log('helllo stopping')
        if (isScreenShared) {
            let tracks = document
                .getElementById("screenSharing")
                .srcObject.getTracks();

            tracks.forEach((track) => track.stop());
            setIsScreenShared(false);
        }
        // document.getElementById('screenSharing').srcObject = streamOfUser;
        // streamOfUser.srcObject = null;
        // getLocalStream()
    }



    let helper = [];
    useEffect(() => {
        socket.on("permission-admin-to-user", (data) => {
            console.log('Data', data)
        });

        socket.on("response-admin-to-user", (data) => {
            // console.log(data)
        });
    }, []);
    socket.on("admin-response-to-request", (data) => {
        // toast.success('Someone is asking for permission to connect through video....')
        setUserDetails({ ...data });
        setAllReq(data);
        setPermissionResponseModal(true);

        // callback({ data })
    });

    socket.on("server-producer-resume", (data) => {

    });
    socket.on("server-producer-pause", (data) => { });




    const [permissionResponse, setPermissionResponse] = useState(false);



    const audioStat = () => {
        socket.emit("audio-stat", "1234");
    };
    // console.log("remote pip", remoteProducerIdForPip)
    const pipSupported = document.pictureInPictureEnabled;
    // const videoRef = useRef(null);
    const handleCloseProduce = (id) => {
        socket.emit("handle-user-camera", {
            userId: id,
            status: false,
            for: "video",
            roomName: roomsFromPanel,
        });
    };
    const handleClick = async (id) => {
        const videoRef = document.getElementById(id);

        // if (!videoRef.current) return;
        try {
            if (videoRef.current !== document.pictureInPictureElement) {
                await videoRef.requestPictureInPicture();
            } else {
                await document.exitPictureInPicture();
            }
        } catch (err) {
            console.log(err);
        }
    };




    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    useEffect(() => {
        setPinFooter(true)
    }, [])

    return (
        <div
            onDoubleClick={onDoubleClickHandler} style={{ height: '100vh' }}
        >


            {role !== "moderator" && chatPage !== 'mod' && (
                <div
                    id="localVideoContainer"
                    style={{}}

                >
                    {/* <span className='host-tag'>Host</span> */}

                    <video
                        id="localVideo"
                        autoPlay
                        className="video"
                        muted
                        style={{
                            minWidth: isScreenShared ? "200px" : "100%",
                            maxWidth: isScreenShared ? "200px" : "100%",
                            height: !pinFooter ? "100vh" : "90vh",
                            position: isScreenShared ? "absolute" : "",
                            right: "50px",
                            bottom: "25%",
                        }}
                    ></video>
                </div>
            )}

            <div
                id="videoContainer-host"
                style={{
                    position: role !== "moderator" ? "absolute" : "",
                    right: role !== "moderator" ? "40px" : "",
                    bottom: role !== "moderator" ? "20px" : "",
                    width: role !== "moderator" ? "500px" : "",
                    height: role !== "moderator" ? "500px" : "",
                }}
            >
                {/* <video id='screenSharing' autoPlay muted style={{ width: '950px', display: isScreenShared ? "" : 'none', marginLeft: '0px', height: '500px', background: 'red' }} ></video> */}
            </div>
            {!userCame && !showChat && < div className='user-videos' style={{
                //  height: !pinFooter ? "95vh" : "84vh", 
                height: "84vh",
                width: showChat ? '60%' : '100%'
            }}>
                <div className='user'>

                    <svg fill="rgba(211, 211, 211, 0.959)" height="80px" width="80px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 60 60">
                        <g>
                            <path d="M55.201,15.5h-8.524l-4-10H17.323l-4,10H12v-5H6v5H4.799C2.152,15.5,0,17.652,0,20.299v29.368
		C0,52.332,2.168,54.5,4.833,54.5h50.334c2.665,0,4.833-2.168,4.833-4.833V20.299C60,17.652,57.848,15.5,55.201,15.5z M8,12.5h2v3H8
		V12.5z M58,49.667c0,1.563-1.271,2.833-2.833,2.833H4.833C3.271,52.5,2,51.229,2,49.667V20.299C2,18.756,3.256,17.5,4.799,17.5H6h6
		h2.677l4-10h22.646l4,10h9.878c1.543,0,2.799,1.256,2.799,2.799V49.667z"/>
                            <path d="M30,14.5c-9.925,0-18,8.075-18,18s8.075,18,18,18s18-8.075,18-18S39.925,14.5,30,14.5z M30,48.5c-8.822,0-16-7.178-16-16
		s7.178-16,16-16s16,7.178,16,16S38.822,48.5,30,48.5z"/>
                            <path d="M30,20.5c-6.617,0-12,5.383-12,12s5.383,12,12,12s12-5.383,12-12S36.617,20.5,30,20.5z M30,42.5c-5.514,0-10-4.486-10-10
		s4.486-10,10-10s10,4.486,10,10S35.514,42.5,30,42.5z"/>
                            <path d="M52,19.5c-2.206,0-4,1.794-4,4s1.794,4,4,4s4-1.794,4-4S54.206,19.5,52,19.5z M52,25.5c-1.103,0-2-0.897-2-2s0.897-2,2-2
		s2,0.897,2,2S53.103,25.5,52,25.5z"/>
                        </g>
                    </svg>
                    <p> User Feed Will Appear Here.. Once Connected</p>
                </div>



            </div>}



            {
                pollDisplay && (
                    <div>
                        <PollContainer
                            setPollDisplay={setPollDisplay}
                            socket={socket}
                            lectureFromPanel={lectureFromPanel}
                            batchesFromPanel={batchesFromPanel}
                        />
                    </div>
                )
            }

            {
                confirmDisplay && (
                    <div>
                        <Confirmation
                            lectureFromPanel={lectureFromPanel}
                            setConfirmDisplay={setConfirmDisplay}
                        />
                    </div>
                )
            }



            <Draggable>
                <div
                    id="videoContainer"
                    style={{
                        position: "absolute",
                        left: "80px",
                        top: "15%",
                        width: "705px",
                        height: "387px",
                    }}
                >
                    {/* <video id='screenSharing' autoPlay muted style={{ width: '950px', display: isScreenShared ? "" : 'none', marginLeft: '0px', height: '500px', background: 'red' }} ></video> */}
                </div>
            </Draggable>
            {
                infoDisplay && (
                    <div>
                        <Info
                            setInfoDisplay={setInfoDisplay}
                            lectureData={lectureData}
                            permissionResponseModal={permissionResponseModal}
                            allReq={allReq}
                            answerForPermission={answerForPermission}
                            updatePermission={updatePermission}
                        />
                    </div>
                )
            }
            {
                doubtDisplay && (
                    <div>
                        <Doubts
                            setDoubtDisplay={setDoubtDisplay}
                            lectureIds={lectureFromPanel}
                            roomsFromPanel={roomsFromPanel}
                            setEnableDoubts={setEnableDoubts}
                            enableDoubts={enableDoubts}
                            socket={socket}
                            lectureFromPanel={lectureFromPanel}
                            getAllDoubts={getAllDoubts}
                            permissionResponseModal={permissionResponseModal}
                            allReq={allReq}
                            answerForPermission={answerForPermission}
                            updatePermission={updatePermission}
                        />
                    </div>
                )
            }

            {
                resourceDisplay && (
                    <div>
                        <Resources
                            setResourceDisplay={setResourceDisplay}
                            lectureData={lectureData}
                            permissionResponseModal={permissionResponseModal}
                            allReq={allReq}
                            answerForPermission={answerForPermission}
                            updatePermission={updatePermission}
                        />
                    </div>
                )
            }

            {
                showChat && (<ChatContainer
                    userCame={userCame}
                    setUserCame={setUserCame}
                    showParticipantsDirectly={showParticipants}
                    sendMessage={sendMessage}
                    msgList={msgList}
                    mySocketId={mySocketId}
                    participantsList={participantsListOfUser}
                    socket={socket}
                    roomName={roomName}
                    name={name}
                    setMsgList={setMsgList}
                    batchNames={batchesFromPanel?.map((item) => item?.batchName)}
                    roomNames={roomsFromPanel}
                    roomNamesFull={roomsFromPanelFullDetails}
                    setIsMicOn={setIsMicOnUser}
                    isMicOn={isMicOnUser}
                    audioPause={audioPause}
                    audioResume={audioResume}
                    setShowChat={setShowChat}
                    setShowParticipantsDirectly={setShowParticipants}
                />)
            }

            <div
                style={{
                    height: "100px",
                    cursor: "pointer",
                    position: "fixed",
                    width: "100%",
                    bottom: "0",
                }}
                onMouseEnter={() => setFooterShow(true)}
                onMouseLeave={() => setFooterShow(false)}
            >
                {(footerShow || pinFooter) && (<Footer
                    from='chat'
                    setIsCameraOn={setIsCameraOn}
                    isCameraOn={isCameraOn}
                    role={role}
                    setPinFooter={setPinFooter}
                    pinFooter={pinFooter}
                    lectureData={lectureData}
                    setShowChat={setShowChat}
                    showChat={showChat}
                    setShowParticipants={setShowParticipants}
                    showParticipants={showParticipants}
                    stopCamera={hideCam}
                    playCamera={showCam}
                    stopAudio={stopAudio}
                    playAudio={playAudio}
                    setIsMicOn={setIsMicOn}
                    isMicOn={isMicOn}
                    // startCapture={startCapture}
                    // stopCapture={stopCapture}
                    // isScreenShared={isScreenShared}
                    audioPause={audioPause}
                    audioResume={audioResume}
                    socket={socket}
                    setPollDisplay={setPollDisplay}
                    pollDisplay={pollDisplay}
                    doubtDisplay={doubtDisplay}
                    setDoubtDisplay={setDoubtDisplay}
                    infoDisplay={infoDisplay}
                    setInfoDisplay={setInfoDisplay}
                    resourceDisplay={resourceDisplay}
                    setResourceDisplay={setResourceDisplay}
                    setConfirmDisplay={setConfirmDisplay}
                    confirmDisplay={confirmDisplay}
                />)}
            </div>
        </div >
    )
}

export default ChatPage