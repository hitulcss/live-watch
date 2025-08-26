import { useState } from 'react'
import './PollContainer.css'
import FirstScreen from './components/FirstScreen'
import SecondScreen from './components/SecondScreen'
import ThirdScreen from './components/ThirdScreen'
import FourthScreen from './components/FourthScreen'
import Draggable from 'react-draggable'
import CancelIcon from '@mui/icons-material/Cancel';

const PollContainer = ({ socket, lectureFromPanel, setPollDisplay }) => {
    const [pollIds, setPollIds] = useState([])

    const [screens, setScreens] = useState({
        first: true, second: false, third: false, fourth: false, fifth: false
    })


    const [type, setType] = useState('single')

    const [pollDetails, setPollDetails] = useState({
        correctOptions: []
    })

    // console.log('Poll Details', pollDetails)

    return (<div className='poll-main-container' style={{ width: '100%', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <Draggable >
            <div className="poll-container">


                <div className="poll-header">Poll  <CancelIcon style={{ cursor: 'pointer', zIndex: '10000', top: '2%', right: '2%' }} className='modal-close-icon' onClick={() => setPollDisplay(false)} /></div>
                {screens?.first && <div className="first">
                    <FirstScreen setScreens={setScreens} setPollDetails={setPollDetails} />
                </div>}
                {screens?.second && <div className="second">
                    <SecondScreen setScreens={setScreens} setType={setType} type={type} setPollDetails={setPollDetails} pollDetails={pollDetails} />
                </div>}
                {screens?.third && <div className="third">
                    <ThirdScreen pollIds={pollIds} setPollIds={setPollIds} setScreens={setScreens} setType={setType} type={type} setPollDetails={setPollDetails} pollDetails={pollDetails} socket={socket} lectureFromPanel={lectureFromPanel} />
                </div>}
                {screens?.fourth && <div className="fourth">
                    <FourthScreen pollIds={pollIds} setScreens={setScreens} setType={setType} type={type} setPollDetails={setPollDetails} socket={socket} lectureFromPanel={lectureFromPanel} />
                </div>}
            </div>
        </Draggable>
    </div>)
}

export default PollContainer