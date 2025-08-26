import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PollContainer from "../components/poll/PollContainer"
import axios from "axios"


const HomePage = () => {
    const [roomName, setRoomName] = useState()
    const [name, setName] = useState()
    const [batch, setBatch] = useState()
    const [mentor, setMentor] = useState()
    const navigate = useNavigate()



    return (
        <>
            {/* <PollContainer /> */}

            <h1>Enter Room Name</h1>

            <input onChange={(e) => { setRoomName(e.target.value) }} placeholder="Enter Room Name....." />
            <input onChange={(e) => { setName(e.target.value) }} placeholder="Enter Name....." />
            <input onChange={(e) => { setBatch(e.target.value) }} placeholder="Enter Batch Name....." />
            <input onChange={(e) => { setMentor(e.target.value) }} placeholder="Enter Mentor Name....." />
            <button onClick={() => navigate(`/two-way/${roomName}/${name}/${batch}/${mentor}`)}>Join</button>
        </>
    )
}
export default HomePage;