//Imports
import { Device } from "mediasoup-client";
import { useParams } from "react-router-dom";
import Footer from "../components/footer/Footer";
import "./Mediasoup.css";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import PollContainer from "../components/poll/PollContainer";
import Info from "../components/info/Info";
import Resources from "../components/resources/Resources";
import Confirmation from "../components/confirmationmodal/Confirmation";
import Draggable from "react-draggable";
import { TwoWayData } from "../context/TwoWayContext";
import socket from "../socket/socket";
import { GoMoveToEnd } from "react-icons/go";
import { dragElement, onDoubleClickHandler } from "../utils/UIFuntions";
;


console.log("socket", socket);

function MediaSoup() {



    const {
        showChat,
        setShowChat,
        showParticipants,
        setShowParticipants,
        setParticipantsListOfUser,
        setOnlyProducer,
        roomsFromPanel,
        batchesFromPanel,
        lectureFromPanel,
        lectureData,
        loading,
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
        isMicOn,
        setIsMicOn,
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
        videoProducerId,
        setVideoProducerId,
        setAudioProducerId,
        permissionResponseModal,
        setPermissionResponseModal,
        allReq,
        setAllReq,
        setUserDetails,
        answerForPermission,
        updatePermission,
    } = useContext(TwoWayData)




    //refersh confirmation
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            // Custom logic to handle the refresh
            // Display a confirmation message or perform necessary actions
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const role = JSON.parse(localStorage.getItem("details"))?.role;

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

    // setInterval(() => {
    //     const start = Date.now();

    //     socket.emit("ping", () => {
    //         const duration = Date.now() - start
    //         // if (duration > 1 && duration < 14) {
    //         if (false) {
    //             const constraints = {
    //                 width: { min: 640, ideal: 1920, max: 1920 },
    //                 height: { min: 400, ideal: 1080 },
    //                 aspectRatio: 1.777777778,
    //                 frameRate: { max: 30 },
    //                 facingMode: { exact: "user" },
    //             };
    //             localVideo?.getAudioTracks()[0]?.applyConstraints(constraints)
    //             console.log(localVideo?.getAudioTracks()[0]?.getConstraints())
    //         }
    //         // console.log(localVideo?.getAudioTracks()[0]?.getConstraints())
    //         // console.log(duration);
    //     });
    // }, 1000);

    // console.log(navigator.mediaDevices.getSupportedConstraints())
    const streamSuccess = (stream) => {
        if (role == "moderator") {
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
                isAdmin: role == "moderator" ? false : true,
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
            if (role !== "moderator") {
                createSendTransport();
            } else {
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

        audioProducer = await producerTransport.produce(audioParams);
        // console.log('Video Params', videoParams)
        videoProducer = await producerTransport.produce(videoParams);
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

                    // connectRecvTransport(consumerTransport, remoteProducerId, params.id);
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
            if (!selfVideo) {
                console.log('new-producer', { producerId, socketId, name, isAdmin, selfVideo })
                signalNewConsumerTransport(producerId);
            }
        }
    );

    const getProducers = () => {
        socket.emit("getProducers", { data: "" }, (producerIds) => {
            // console.log('producerIds', producerIds)
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
                if (params.kind == "audio") {
                    if (role == "moderator") {
                        videoContainer = document.getElementById("videoContainer-host");
                    } else {
                        videoContainer = document.getElementById("videoContainer");
                    }

                    newElem.innerHTML =
                        '<audio id="' + remoteProducerId + '" autoplay></audio>';
                } else {

                    newElem.setAttribute("class", "remoteVideo");

                    if (params.isAdmin) {
                        if (role == "moderator") {
                            videoContainer = document.getElementById("videoContainer-host");
                            newElem.innerHTML =
                                '<video id = "' +
                                remoteProducerId +
                                '" autoplay class="video-host" ></video>';
                        } else {
                            videoContainer = document.getElementById("videoContainer");
                            newElem.innerHTML =
                                '<video id = "' +
                                remoteProducerId +
                                '" autoplay class="video" ></video>';
                        }
                        host.innerText = "Host";

                        host.style.position = "absolute";
                        host.style.color = "#ffffff8f";
                        host.style.top = "30px";
                        host.style.right = "70px";
                        host.style.background = "#80808073";

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

                    } else {
                        videoContainer = document.getElementById("videoContainer");
                        if (role == "moderator") {
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

                            newElem.appendChild(imgIcon);
                        }
                    }
                }

                videoContainer.appendChild(newElem);

                dragElement(document.getElementById(remoteProducerId));

                const { track } = consumer;


                pip.addEventListener("click", () => {
                    handleClick(remoteProducerId);
                });
                imgIcon.addEventListener("click", () => {
                    handleCloseProduce(params?.socketIdOfUser);
                });
                document.getElementById(remoteProducerId).style.width = "1200px";
                document.getElementById(remoteProducerId).srcObject = new MediaStream([
                    track,
                ]);


                socket.emit("consumer-resume", {
                    serverConsumerId: params.serverConsumerId,
                });
            }
        );
    };

    socket.on("producer-closed", ({ remoteProducerId }) => {

        // server notification is received when a producer is closed
        // we need to close the client-side consumer and associated transport

        if (consumerTransports.length !== 0) {
            const producerToClose = consumerTransports.find(
                (transportData) => transportData.producerId === remoteProducerId
            );
            producerToClose?.consumerTransport.close();
            producerToClose?.consumer.close();
            setOnlyProducer(false);

            // remove the consumer transport from the list
            consumerTransports = consumerTransports?.filter(
                (transportData) => transportData.producerId !== remoteProducerId
            );

            // remove the video div element
            videoContainer?.removeChild(
                document.getElementById(`td-${remoteProducerId}`)
            );
        } else {
            setOnlyProducer(true);

        }
    });

    //UI


    socket.on("participants", (data) => {


        setParticipantsListOfUser(data);

    });
    socket.on("doubt-session", (data) => { });




    const changeUserStatus = (data) => {
        const videoContainer = document.getElementById("videoContainer");


        if (!data.videoStatus && data.videoProducerId !== videoProducerId) {
            const helper = document.getElementById(`td-${data.videoProducerId}`);

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

            if (helper) {
                helper.style.display = "none";
                document.getElementById(`td-${data.videoProducerId}`).style.display =
                    "";
            } else {
            }
        }
    };




    const connectSendScreenTransport = async () => {

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

        });

        socket.on("response-admin-to-user", (data) => {

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


    const audioPause = (id) => {
        // socket.emit('audio-pause', id)
    };
    const audioResume = (id) => {
        // socket.emit('audio-resume', id)
    };
    const audioStat = () => {
        socket.emit("audio-stat", "1234");
    };

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



    //chat-redirection
    const [chatRedirected, setChatRedirected] = useState(false)
    // localStorage.setItem('chat-redirected', false);
    const handleChatRedirection = () => {
        if (!localStorage.getItem('chat-redirected') || localStorage.getItem('chat-redirected') == 'false') {
            localStorage.setItem('chat-redirected', true);
            setChatRedirected(true)
            window.open(`/chat-page/${roomName2}`)
        }
        else {
            toast.error('Already Opened ')
        }
    }

    useEffect(() => {

        setChatRedirected(localStorage.getItem('chat-redirected'))

    }, [])



    return (
        <div className="two_way_container" style={{}}>

            {<button className="chat_button" onClick={handleChatRedirection}>Open Chat <GoMoveToEnd /></button>}
            <div className="video_ui_container">
                {pollDisplay && (
                    <div>
                        <PollContainer
                            setPollDisplay={setPollDisplay}
                            socket={socket}
                            lectureFromPanel={lectureFromPanel}
                            batchesFromPanel={batchesFromPanel}
                        />
                    </div>
                )}

                {confirmDisplay && (
                    <div>
                        <Confirmation
                            lectureFromPanel={lectureFromPanel}
                            setConfirmDisplay={setConfirmDisplay}
                        />
                    </div>
                )}
                {infoDisplay && (
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
                )}
                {resourceDisplay && (
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
                )}


                {role !== "moderator" && (
                    <div
                        id="localVideoContainer"
                        style={{}}
                        onDoubleClick={onDoubleClickHandler}
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

                <Draggable>
                    <div
                        id="videoContainer"
                        style={{
                            position: "absolute",
                            right: "40px",
                            bottom: "20px",
                            width: "500px",
                            height: "500px",
                        }}
                    >
                        {/* <video id='screenSharing' autoPlay muted style={{ width: '950px', display: isScreenShared ? "" : 'none', marginLeft: '0px', height: '500px', background: 'red' }} ></video> */}
                    </div>
                </Draggable>
            </div>

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
                {(footerShow || pinFooter) && (
                    <Footer
                        from='admin'
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
                        startCapture={startCapture}
                        stopCapture={stopCapture}
                        isScreenShared={isScreenShared}
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
                    />
                )}
            </div>
        </div>
    );
}

export default MediaSoup;
