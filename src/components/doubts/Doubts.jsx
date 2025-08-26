import { useEffect, useState } from 'react';
import '../tabs/LiveTabs.css'
import { IoMdTime } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import Draggable from 'react-draggable';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import SendIcon from '@mui/icons-material/Send';
import toast from 'react-hot-toast';
import CancelIcon from '@mui/icons-material/Cancel';




const Doubts = ({
    permissionResponseModal,
    allReq,
    answerForPermission,
    updatePermission, lectureFromPanel, socket, roomsFromPanel, setDoubtDisplay, lectureIds
}) => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [isEdit, setIsEdit] = useState(false);
    const [solvedAnswer, setSolvedAnswer] = useState('')
    const [doubtId, setDoubtId] = useState('')
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        getAllDoubts()
    }, [])
    const [getDoubts, setGetDoubts] = useState([])
    const getAllDoubts = () => {
        let helper = []
        lectureFromPanel?.map(item => helper.push(item?.lectureId))
        //console.log('Lecture doubts', helper)
        socket.emit('getAllDoubts', {
            lectureIds: helper
        }, (data) => {
            setGetDoubts(data.data)
            //console.log('Douts', data)
        })
    }
    const getDoubt = () => {
        let helper = []
        lectureFromPanel?.map(item => helper.push(item?.lectureId))
        //console.log('Lecture doubts', helper)
        socket.emit('getDoubts', {
            lectureId: helper[0]
        }, (data) => {
            setGetDoubts(data.data)
            //console.log('Douts', data)
        })
    }
    // useEffect(() => {
    socket.on('doubt-added', () => {
        //console.log('Doubt added')
        getAllDoubts()
    })
    // }, [])
    const solveDoubt = (id, mentorId, userId) => {

        if (solvedAnswer == '') {
            toast.error("Enter Something... ")
        } else {
            socket.emit('solveDoubt-id', {
                answer: solvedAnswer, resolveTime: '45', mentorId: mentorId, isResolved: true, id: id, userId: userId
            }, (data) => {
                //console.log('Douts', data)
                getAllDoubts()
                setIsEdit(false)
            })
        }

    }
    const [enableDoubts, setEnableDoubts] = useState(false);
    //console.log('initial state ', enableDoubts)
    useEffect(() => {
        callEmit()
    }, [enableDoubts])
    // const handleEnableDoubt = () => {


    //     //console.log('toggle', enableDoubts)
    //     setEnableDoubts(prev => !prev);

    //     callEmit(enableDoubts)

    // }

    const callEmit = () => {
        //console.log('toggle in callaEmit', enableDoubts)
        socket.emit('doubtStatus', { status: enableDoubts, roomName: roomsFromPanel, lectureIds: lectureIds }, (data) => {
            //console.log("doubtStatus" + data);

        })
    }

    console.log('GetAll', allReq)
    // //console.log('doubt id', doubtId)
    return (
        <Draggable>
            <div className="switch_tabs">
                <CancelIcon className='modal-close-icon' style={{ top: '5%', right: '4%' }} onClick={() => setDoubtDisplay(false)} />
                <div className="tab-buttons">
                    <button
                        className={activeTab === "tab1" ? "active" : ""}
                        onClick={() => handleTabClick("tab1")}

                        style={{ background: activeTab == 'tab1' ? 'var(--secondaryColor)' : 'white', color: activeTab == 'tab1' ? 'white' : 'black' }}
                    >
                        Request(Audio/Video)
                    </button>
                    {/* <button onClick={getAllDoubts}>GET</button> */}
                    {/* <button onClick={getDoubt}>GET SINGLE DOUBT</button> */}
                    {/* <button onClick={getAllDoubts}>GET</button> */}
                    <button
                        className={activeTab === "tab2" ? "active" : ""}
                        style={{ background: activeTab == 'tab2' ? 'var(--secondaryColor)' : 'white', color: activeTab == 'tab2' ? 'white' : 'black' }}
                        onClick={() => handleTabClick("tab2")}
                    >
                        All Doubt
                    </button>
                    <button style={{ backgroundColor: enableDoubts ? 'green' : 'red' }} onClick={(e) => {
                        setEnableDoubts(prev => !prev);
                        // handleEnableDoubt()
                    }}> {enableDoubts ? 'Doubts Enabled' : 'Enable Doubts'}</button>


                </div>
                <div className="tab-content">

                    {activeTab === "tab1" && (
                        // <h1></h1>
                        <>


                            {allReq?.length > 0 ? allReq?.map((item, index) => {
                                //console.log('Requests', item)
                                return < div className="request_audio_video_wrapper">
                                    <div className="request_video_audio">
                                        <div className="requests">
                                            <div className="requests_upper">
                                                <p>
                                                    {item?.name}
                                                    {/* from{" "}
                                                    <span style={{ color: "var(--secondaryColor)" }}>
                                                        {item?.batch}
                                                    </span>{" "}
                                                    in{" "}
                                                    <span style={{ color: "var(--secondaryColor)" }}>
                                                        {" "}
                                                        {item?.room}
                                                    </span>{" "} */}
                                                    {/* Mentor {">"} Harsh singh{" "} */}
                                                </p>
                                            </div>
                                            <p style={{ border: "1px solid #efefef" }}></p>
                                            <div className="requests_lower">
                                                <h2>Request For Camera & Mic Discussion some topics </h2>
                                                <div className="right_req_buttons">
                                                    <button className="request_accept_btn" onClick={() => {
                                                        answerForPermission(true, item)
                                                        updatePermission(item?.userId, 'accept')
                                                    }}>Accept</button>
                                                    <button className="request_decline_btn" onClick={() => {
                                                        answerForPermission(false, item)
                                                        updatePermission(item?.userId, 'delete')
                                                    }}>Decline</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            }) : <div className='empty_requests'>No Requests</div>}
                        </>


                    )}
                    {activeTab === "tab2" && (

                        getDoubts?.length > 0 ?
                            getDoubts?.map((item, index) => {
                                return < div className="doubts_wrapper" key={index}>
                                    <div className="doubts_box">
                                        <div className="doubts_upper">
                                            {" "}
                                            <p>
                                                {item?.user}
                                                {/* from{" "}

                                                <span style={{ color: "var(--secondaryColor)" }}>
                                                    {item?.roomDetails?.batchName}
                                                </span>{" "}
                                                in{" "}
                                                <span style={{ color: "var(--secondaryColor)" }}>
                                                    {" "}
                                                    {item?.roomDetails?.roomName}
                                                </span>{" "} */}
                                                {/* {item?.roomDetails?.mentor[0]?.mentorName} {">"} Harsh singh{" "} */}
                                            </p>
                                            <div className="doubt_rightside">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    <IoMdTime /> <p>{item?.time}</p>
                                                </div>
                                                {/* <button onClick={() => { solveDoubt(item?.id, item?.roomDetails?.mentor[0]?.mentorId, item?.userId) }} >Reply</button> */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    <FaCheckCircle /> <p>{item?.isResolved ? <span style={{ color: 'green', fontWeight: '600' }}>Resolved</span > : <span style={{ color: 'red', fontWeight: '600' }}   >Not Resolved</span>}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ border: "1px solid #efefef" }}></p>
                                        <div className="doubts_lower">
                                            <p>
                                                {item?.doubt}{" "}
                                            </p>

                                            <p style={{ border: "1px solid #efefef" }}></p>
                                            <div className='solved-container'>
                                                {isEdit && doubtId == item?.id ? <input placeholder='Solve here...' type='text' onChange={(e) => {

                                                    setSolvedAnswer(e.target.value)
                                                }}
                                                /> : <p>
                                                    {item?.answer !== '' ? item?.answer : 'Not Solved'}{" "}
                                                </p>}

                                                {isEdit && doubtId == item?.id ? <div><EditIcon sx={{ cursor: 'pointer' }} onClick={(e) => {

                                                    setIsEdit(false)
                                                    setDoubtId(item?.id)
                                                }} />
                                                    <SendIcon sx={{ cursor: 'pointer' }} onClick={() => { solveDoubt(item?.id, item?.roomDetails?.mentor[0]?.mentorId, item?.userId) }} />
                                                </div>
                                                    : <EditOffIcon sx={{ cursor: 'pointer' }} onClick={() => {
                                                        setIsEdit(true)
                                                        setDoubtId(item?.id)
                                                    }

                                                    } />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                            : <div className='empty_requests'>No Doubts</div>
                    )}
                </div>
            </div>
        </Draggable >
    )
}
export default Doubts