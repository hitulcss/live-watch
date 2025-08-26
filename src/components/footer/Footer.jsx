import './Footer.css'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamIcon from '@mui/icons-material/Videocam';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuIcon from '@mui/icons-material/Menu';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useEffect, useState } from 'react';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import EmojiPicker from 'emoji-picker-react';
import { TbFileDescription } from "react-icons/tb";
import { MdOutlineSnippetFolder } from "react-icons/md";
import InfoIcon from '@mui/icons-material/Info';
import TopicIcon from '@mui/icons-material/Topic';
import { useReactMediaRecorder } from 'react-media-recorder';
import CloseIcon from '@mui/icons-material/Close';
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';
import Switch from '@mui/material/Switch';




const Footer = ({ from, setIsMicOn, isMicOn, isCameraOn, setIsCameraOn, role, pinFooter, setPinFooter, lectureData, setConfirmDisplay, confirmDisplay, resourceDisplay, infoDisplay, doubtDisplay, setResourceDisplay, setInfoDisplay, setDoubtDisplay, setPollDisplay, pollDisplay, showChat, setShowChat, setShowParticipants, showParticipants, stopCamera, isScreenShared, playCamera, stopAudio, playAudio, startCapture, stopCapture, isCameraOnFromScreenShare, audioPause, audioResume, socket }) => {

    //pin footer


    const handleChange = (e) => {
        setPinFooter(e.target.checked);
    };

    const [time, setTime] = useState(0);

    // state to check stopwatch running or not
    const [isRunning, setIsRunning] = useState(false);

    let strr = 'hjbib/*/uyub'
    // console.log(strr?.split('/*/')[0])

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => setTime(time + 1), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    // Hours calculation
    const hours = Math.floor(time / 360000);

    // Minutes calculation
    const minutes = Math.floor((time % 360000) / 6000);

    // Seconds calculation
    const seconds = Math.floor((time % 6000) / 100);

    // Milliseconds calculation
    const milliseconds = time % 100;

    // Method to start and stop timer
    const startAndStop = () => {
        setIsRunning(!isRunning);
    };

    // Method to reset timer back to 0
    const reset = () => {
        setTime(0);
    };


    const handleChatParticipants = () => {
        setShowChat(!showChat)
        setShowParticipants(true)
    }


    const [dropdown, setDropdown] = useState(false)


    //chat page and admin page conditions
    useEffect(() => {
        if (from == 'chat') {
            // setPinFooter(true)
            setShowChat(true)
        }
    }, [from])


    const [isSSOn, setIsSSOn] = useState(true)
    const [showEmoji, setShowEmoji] = useState(false)
    const displayMediaOptions = {
        video: {
            displaySurface: "browser",
        },
        audio: {
            suppressLocalAudioPlayback: false,
        },
        preferCurrentTab: false,
        selfBrowserSurface: "exclude",
        systemAudio: "include",
        surfaceSwitching: "include",
        monitorTypeSurfaces: "include",
    };


    const { status, startRecording, stopRecording, mediaBlobUrl, pauseRecording, resumeRecording } =
        useReactMediaRecorder({
            screen: {
                width: 1920,
                height: 1080,
                frameRate: 60 // Lower frame rate to reduce file size and processing
            }
        });
    // console.log(mediaBlobUrl)

    const [recordedData, setRecordedData] = useState(null);
    const [recordedBlob, setRecordedBlob] = useState(null);

    const handleStopRecording = () => {
        // In this example, blobUrl is passed from react-media-recorder
        fetch(mediaBlobUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                setRecordedBlob(url);
                // Create an anchor element
                const a = document.createElement('a');
                // Set the href attribute to the Blob URL
                a.href = url;
                // Set the download attribute to specify the filename
                a.download = 'recorded_media.mp4';
                // Append the anchor element to the body
                document.body.appendChild(a);
                // Programmatically trigger a click event on the anchor element
                a.click();
                // Remove the anchor element from the DOM
                document.body.removeChild(a);
            })
            .catch((error) => {
                console.error('Error saving recording:', error);
            });
    };

    useEffect(() => {
        // async function fetchBlobData() {
        //     const response = await fetch(mediaBlobUrl);
        //     const blob = await response.blob();
        //     setRecordedData(blob);
        // }
        // // fetchBlobData();
        // handleStopRecording()
    }, [mediaBlobUrl]);



    // const handleStopRecording = (blobUrl) => {
    //     // In this example, blobUrl is passed from react-media-recorder
    //     fetch(mediaBlobUrl)
    //         .then((response) => response.blob())
    //         .then((blob) => {
    //             const reader = new FileReader();
    //             reader.readAsDataURL(blob);
    //             reader.onloadend = () => {
    //                 const base64data = reader.result;
    //                 // Store the base64 encoded data into local storage
    //                 localStorage.setItem('recordedMedia', base64data);

    //                 // Set the recordedBlob state to display or further process the recording
    //                 setRecordedBlob(base64data);
    //             };
    //         })
    //         .catch((error) => {
    //             console.error('Error saving recording:', error);
    //         });
    // };


    // console.log('Recorded data', recordedBlob)





    const downloadRecording = () => {
        const pathName = `C:/downloads/${lectureData[0]?.lectureTitle}.mp4`;
        try {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // for IE
                window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
            } else {
                // for Chrome
                const link = document.createElement("a");
                link.href = mediaBlobUrl;
                link.download = pathName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [recordingExpand, setRecordingExpand] = useState(false)
    const [recordingStarted, setRecordingStarted] = useState(false)

    // useEffect(() => {
    //     if (status == 'idle') {
    //         reset()
    //         // startAndStop()
    //     }
    // }, [status])
    // console.log('Status', status)
    // console.log('recording staretdd', recordingStarted)
    return (
        <>
            {/* {showEmoji && < div className='emoji_container' >
                <EmojiPicker />
            </div >} */}

            {/* Recording */}
            {/* <div className="recording-controls">
                {!recordingExpand && <><span onClick={() => {
                    if (status == 'idle' || status == 'stopped') {
                        startRecording()
                        startAndStop()
                        setRecordingStarted(true)
                    }
                    else {
                        stopRecording()
                        reset()
                        startAndStop()
                        setRecordingStarted(false)
                    }
                }} style={{ borderRight: '1px solid lightgray' }}> {(status == 'idle' || status == 'stopped') ? ' Start Recording' : 'Stop Recording'}</span>
                    <span style={{ borderRight: '1px solid lightgray' }}>{hours}:{minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}

                    </span>
                    {recordingStarted && <span onClick={() => {
                        if (status !== 'paused') {
                            pauseRecording()
                            startAndStop()
                        } else if (status == 'paused') {
                            resumeRecording()
                            startAndStop()

                        }
                    }} style={{ borderRight: '1px solid lightgray' }}>
                        {(status == 'paused') ? 'Resume' : 'Pause'}

                    </span>}
                    {(status == 'stopped') && <span onClick={() => downloadRecording()} style={{ borderRight: '1px solid lightgray' }}>Download</span>}</>}
                {!recordingExpand && <span onClick={() => setRecordingExpand(true)} style={{ cursor: 'pointer' }}><CloseIcon /></span>}
                {recordingExpand && <span onClick={() => setRecordingExpand(false)} style={{ cursor: 'pointer' }}><EmergencyRecordingIcon /></span>}
            </div> */}

            <div className="footer_container" style={{ justifyContent: from == 'chat' && 'flex-end' }}>
                {role !== 'moderator' && from == 'admin' && <div className="footer_left">
                    <div className="footer_mic" style={{
                        borderColor: 'gray'
                    }}>
                        {isMicOn ? <div style={{ borderRight: '1px solid black', padding: '10px 10px' }} onClick={() => {
                            stopAudio()
                            setIsMicOn(false)
                            audioPause({ id: socket.id })
                        }}><MicIcon sx={{ color: 'gray' }} /></div> :
                            <div style={{ borderRight: '1px solid black', padding: '10px 10px' }} onClick={() => {
                                playAudio()
                                setIsMicOn(true)
                                audioResume({ id: socket.id })
                            }}>  <MicOffIcon /></div>}
                        <div style={{ padding: '10px 10px' }}><MoreVertIcon sx={{ color: 'gray' }} /></div>

                    </div>
                    <div className="footer_video" style={{
                        borderColor: 'gray'
                    }}>
                        {isCameraOn ? <div style={{ borderRight: '1px solid black', padding: '10px 10px' }} onClick={() => {
                            stopCamera()
                            setIsCameraOn(false)
                        }}><VideocamIcon sx={{ color: 'gray' }} /></div> :
                            <div style={{ borderRight: '1px solid black', padding: '10px 10px' }} onClick={() => {
                                playCamera()
                                setIsCameraOn(true)
                            }}>  <VideocamOffIcon /></div>}
                        <div style={{ padding: '10px 10px' }}><MoreVertIcon sx={{ color: 'gray' }} /></div>

                    </div>

                </div >}
                {role !== 'moderator' && from == 'admin' && <div className="footer_middle">
                    {/* <div className="footer_screenshare" style={{ borderColor: 'gray' }}>
                        {!isScreenShared ? <div style={{ borderRight: '1px solid black', padding: '10px 10px' }} onClick={() => {
                            startCapture(displayMediaOptions)
                            setIsSSOn(false)
                        }
                        }><PresentToAllIcon sx={{ color: 'gray' }} /></div>
                            :
                            <div style={{ borderRight: '1px solid black', padding: '10px 10px' }} onClick={() => {
                                stopCapture()
                                setIsSSOn(true)
                            }}><StopScreenShareIcon sx={{ color: 'gray' }} /></div>
                        }
                        <div style={{ padding: '10px 10px' }}><MoreVertIcon sx={{ color: 'gray' }} /></div>

                    </div> */}
                    {/* <div className="footer_emoji" style={{ borderColor: 'gray' }} onClick={() => setShowEmoji(!showEmoji)}>

                        <div style={{ padding: '10px 10px' }}><EmojiEmotionsIcon sx={{ color: 'gray' }} /></div>

                    </div > */}
                    <div className="footer_exit" style={{
                        borderColor: 'gray'
                    }}>

                        <div style={{ padding: '10px 10px' }} onClick={() => setConfirmDisplay(!confirmDisplay)}><ExitToAppIcon sx={{ background: 'red', color: 'white' }} /></div>

                    </div>

                </ div>}
                <div className="footer_right" >

                    <div className="footer_graph" style={{ borderColor: showParticipants ? '#b042f5' : 'gray' }}>

                        <div style={{ padding: '10px 10px' }} onClick={() => setInfoDisplay(!infoDisplay)}><InfoIcon sx={{ color: infoDisplay ? '#b042f5' : 'gray' }} /></div>

                    </div>

                    <div className="footer_graph" style={{ borderColor: showParticipants ? '#b042f5' : 'gray' }}>

                        <div style={{ padding: '10px 10px' }} onClick={(e) => {

                            setResourceDisplay(!resourceDisplay)
                        }}><TopicIcon sx={{ color: resourceDisplay ? '#b042f5' : 'gray' }} /></div>

                    </div>
                    {from == 'chat' && <div className="footer_graph" style={{ borderColor: showParticipants ? '#b042f5' : 'gray' }}>

                        <div style={{ padding: '10px 10px' }} onClick={() => setDoubtDisplay(!doubtDisplay)}><QuizOutlinedIcon sx={{ color: doubtDisplay ? '#b042f5' : 'gray' }} /></div>

                    </div>}
                    {from == 'admin' && <div className="footer_graph" style={{ borderColor: showParticipants ? '#b042f5' : 'gray' }}>

                        <div style={{ padding: '10px 10px' }} onClick={() => setPollDisplay(!pollDisplay)}><BarChartIcon sx={{ color: pollDisplay ? '#b042f5' : 'gray' }} /></div>

                    </div>}
                    {from == 'chat' && <div className="footer_chat" style={{ borderColor: showChat ? '#b042f5' : 'gray' }}>

                        <div style={{ padding: '10px 10px' }} onClick={() => {
                            setShowChat(!showChat)
                            setShowParticipants(false)
                        }}><ChatBubbleOutlineIcon sx={{ color: showChat ? '#b042f5' : 'gray' }} /></div>

                    </div>}
                    {from == 'chat' && < div className="footer_participants" style={{ borderColor: showParticipants ? '#b042f5' : 'gray' }}>

                        <div style={{ padding: '10px 10px' }}><PeopleAltIcon sx={{ color: showParticipants ? '#b042f5' : 'gray' }} onClick={() => {
                            handleChatParticipants()
                        }} /></div>

                    </div>}
                    <div className="footer_more" style={{
                        borderColor: 'gray'
                    }}>

                        <div style={{ padding: '10px 10px' }}><MenuIcon sx={{ color: 'gray' }} onClick={() => setDropdown(!dropdown)} /></div>

                        {/* <div> */}


                        {/* {dropdown && <div className="dropdown-footer-menu">
                            <p onClick={() => {
                                if (status == 'idle' || status == 'stopped') { startRecording() }
                                else { stopRecording() }
                            }}>
                                {(status == 'idle' || status == 'stopped') ? ' Start Recording' : 'Stop Recording'}

                            </p>
                            <p onClick={() => {
                                downloadRecording()
                            }}>
                            Download
                            
                            </p>
                            
                        </div>} */}
                        {/* <video src={mediaBlobUrl} controls autoPlay loop /> */}
                        {/* </div> */}
                    </div>
                    <div className="" >

                        <div style={{ padding: '10px 10px' }}>
                            <Switch
                                checked={pinFooter}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>

                    </div>
                </div >
            </div >
        </>
    )
}

export default Footer