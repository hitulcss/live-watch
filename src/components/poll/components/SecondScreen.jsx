import toast, { Toaster } from 'react-hot-toast'
import './SecondScreen.css'

const SecondScreen = ({ setScreens, setType, type, setPollDetails, pollDetails }) => {


    const durationArray = [
        { time: 10 },
        { time: 30 },
        { time: 45 },
        { time: 60 },
        { time: 90 },
        { time: 120 },
        { time: 150 },
        // { time: -1 },
    ]

    const noOfOptions = [
        // { options: 1 },
        { options: 2 },
        { options: 3 },
        { options: 4 },
        { options: 5 },
        { options: 6 },
        { options: 7 },
        { options: 8 },
    ]




    return (
        <div className="second-screen-container">
            {/* <Toaster /> */}
            <div className="second-screen-top">
                <div className="second-screen-top-first-section">
                    <span style={{ border: type == 'single' ? '1px solid #9603F2' : '1px solid transparent', color: type == 'single' ? '#9603F2' : 'gray', fontWeight: type == 'single' ? '500' : '1px solid transparent' }} onClick={() => { setType('single') }}>Single</span>
                    <span style={{ border: type == 'multiple' ? '1px solid #9603F2' : '1px solid transparent', color: type == 'multiple' ? '#9603F2' : 'gray', fontWeight: type == 'multiple' ? '500' : '1px solid transparent' }} onClick={() => { setType('multiple') }}>Multiple Choice</span>
                    {/* <span style={{ border: type == 'vote' ? '1px solid #9603F2' : '1px solid transparent', color: type == 'vote' ? '#9603F2' : 'gray', fontWeight: type == 'vote' ? '500' : '1px solid transparent' }} onClick={() => { setType('vote') }}>Vote</span> */}

                </div>
                <div className="second-screen-top-second-section">
                    <h7>Select Poll Duration</h7>
                    <div className='single-radio-input'>

                        {durationArray?.length > 0 && durationArray?.map((item, index) => {
                            return (<> <div className="input-box" key={index}>
                                <input type="radio" id={`duration-${index}`} name="fav_language" value={item?.time} onClick={() => setPollDetails((prev) => ({ ...prev, duration: item?.time }))} />
                                <label for={`duration-${index}`} onClick={() => setPollDetails((prev) => ({ ...prev, duration: item?.time }))}>{item?.time !== -1 ? `${item?.time} sec` : 'Timeless Poll'}</label><br />

                            </div></>)
                        })}



                    </div>
                </div>
                <div className="second-screen-top-third-section">
                    <h7>Select Number Of Option</h7>
                    <div className='single-radio-input'>

                        {noOfOptions?.length > 0 && noOfOptions?.slice(0, type == 'vote' ? 2 : noOfOptions?.length)?.map((item, index) => {
                            return (<> <div className="input-box" key={index}>
                                <input type="radio" id={`options-${index}`} name="noOfOptions" value={item?.options} onClick={() => setPollDetails((prev) => ({ ...prev, noOfOptions: item?.options }))} />
                                <label for={`options-${index}`} onClick={() => setPollDetails((prev) => ({ ...prev, noOfOptions: item?.options }))}>{item?.options}</label><br />

                            </div></>)
                        })}



                    </div>
                </div>
            </div>

            <div className='second-screen-bottom'>
                <button className="" onClick={() => {
                    if (!pollDetails?.noOfOptions || !pollDetails?.duration) {
                        toast.error('Fill Poll Details First...')
                    }
                    else { setScreens((prev) => ({ ...prev, second: false, third: true })) }
                }}>
                    Start poll
                </button>
            </div>
        </div>
    )
}

export default SecondScreen