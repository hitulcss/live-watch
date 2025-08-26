import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './ThirdScreen.css'
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const ThirdScreen = ({ pollIds, setPollIds, setScreens, setType, type, pollDetails, setPollDetails, socket, lectureFromPanel }) => {


    const durationArray = [
        { option: 'A' },
        { option: 'B' },
        { option: 'C' },
        { option: 'D' },
        { option: 'E' },
        { option: 'F' },
        { option: 'G' },
    ]

    const noOfOptions = [
        { options: 1 },
        { options: 2 },
        { options: 3 },
        { options: 4 },
        { options: 5 },
        { options: 6 },
        { options: 7 },
        { options: 8 },
    ]


    //timer
    const [timeLeft, setTimeLeft] = useState(-1);



    useEffect(() => {
        if (timeLeft === 0) {
         
            setTimeLeft('Finished')
        }

        // exit early when we reach 0
        if (timeLeft == -1) return;

        // save intervalId to clear the interval when the
        // component re-renders
        const intervalId = setInterval(() => {

            setTimeLeft(timeLeft - 1);
        }, 1000);

        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
    }, [timeLeft]);

    let helper = []
    const createPoll = async () => {

        let helper = []
        helper = lectureFromPanel?.map(item => item?.lectureId)
    
        socket.emit('pollStarted', 'Poll Started')
        socket.emit('createPoll', {
            ...pollDetails,
            pollType: type,
            isActive: true
            ,
            lectureIds: helper
        }, (data) => {
            

            helper = data.data?.map(item => item?.pollId)
           
            setPollIds(helper)
        })
     
        // const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJmNDI4ZTJlMC1hZmFjLTExZWUtYTcwOC1iMTY4ZjRjMTM4NWMiLCJpYXQiOjE3MDYwMDEwNTEsImV4cCI6MTcwODU5MzA1MX0.IXg7SwUN3qxg9scFmuQ3wwaszFO6AnJ2F3rxnOjRqOo'
        // const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJmNDI4ZTJlMC1hZmFjLTExZWUtYTcwOC1iMTY4ZjRjMTM4NWMiLCJpYXQiOjE3MTA0Njc3MDIsImV4cCI6MTcxMzA1OTcwMn0.R5OVTjKQHvVNyfHcfnhHjfo9rUjjDOQ_cv84OT2icoM'
        // await axios.post('http://localhost:3001/api/v1/lecture/createPoll',
        //     {
        //             ...pollDetails,
        // pollType: type,
        //     lectureIds: ['1', '2']
        //         },
        //     {
        //         headers: {
        //             "content-type": "application/json",
        //             Authorization: `Bearer ${authToken}`,
        //         },
        //     }
        // ).then((res) => console.log(res))
    }
    const getPoll = () => {
   
        socket.emit('getPoll', {

            lectureId: lectureFromPanel[0]?.lectureId,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJiMzEzYjEwMC03N2E3LTExZWUtODNiNi04ZmY1OWQwYjRlNDUiLCJpYXQiOjE3MTA2ODE3NjYsImV4cCI6MTcxMDc2ODE2Nn0.uvwX5qulFC1jX4FkG2wakwy7f0xkQfwfJvjsb0HNo50'
        }, (data) => {
           
        })
    }

    const postResponse = () => {
       
        socket.emit('postResponse', {
            options: ['A'],
            duration: 10,
            pollId: '65f8253243cd70323157450c',
            lectureId: lectureFromPanel[0]?.lectureId,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJiMzEzYjEwMC03N2E3LTExZWUtODNiNi04ZmY1OWQwYjRlNDUiLCJpYXQiOjE3MTA2ODE3NjYsImV4cCI6MTcxMDc2ODE2Nn0.uvwX5qulFC1jX4FkG2wakwy7f0xkQfwfJvjsb0HNo50'
        }, (data) => {
        
        })
    }
    socket.on('student-submission-started', (data) => [
       
    ])

    const postTextDoubt = () => {
        socket.emit('postTextDoubt', { text: 'I have a doubt!!!!' }, (data) => {
            
        })
    }

    return (
        <div className="second-screen-container">
            {/* <button onClick={() => getPoll()}>Get Poll</button> */}
            {/* <button onClick={() => postTextDoubt()}>Poll Text Doubt</button> */}
            {/* <button onClick={() => postResponse()}>Send Poll</button> */}
            {/* <Toaster /> */}
            <div className="second-screen-top">
                <div className="third-screen-top-first-section">
                    <div style={{ width: 200, height: 200 }}>
                        <CircularProgressbar value={timeLeft} maxValue={pollDetails?.duration} text={timeLeft == -1 ? pollDetails?.duration : timeLeft ? timeLeft : `Finished`} />
                    </div>


                </div>
                <div className="second-screen-top-second-section">
                    <h7>Select Correct Answer</h7>
                    <div className='single-radio-input'>

                        {type == 'single' && durationArray?.length > 0 && durationArray?.slice(0, pollDetails?.noOfOptions)?.map((item, index) => {
                            let options = []
                            durationArray?.slice(0, pollDetails?.noOfOptions)?.map(item => options.push(item?.option))

                            return (<> <div className="input-box" key={index}>
                                <input type="radio" id={`duration-${index}`} name="fav_language" value={item?.option} onClick={() => setPollDetails((prev) => ({ ...prev, correctOptions: [item?.option], options: options }))} />
                                <label for={`duration-${index}`}>{item?.option}</label><br />

                            </div></>)
                        })}
                        {/* <fieldset>   */}
                        {type == 'multiple' && durationArray?.length > 0 && durationArray?.slice(0, pollDetails?.noOfOptions)?.map((item, index) => {



                            return (<> <div className="input-box" key={index}>
                                <input type="checkbox" id={`duration-${index}`} value={item?.option} onClick={() => {
                                    let newArray = pollDetails?.correctOptions.length == 0 ? [] : pollDetails?.correctOptions
                                    newArray.push(item?.option)
                                    
                                    let options = []
                                    durationArray?.slice(0, pollDetails?.noOfOptions)?.map(item => options.push(item?.option))

                                    setPollDetails((prev) => ({ ...prev, correctOptions: newArray, options: options }))
                                }} />
                                <label for={`duration-${index}`}>{item?.option}</label><br />

                            </div></>)
                        })}
                        {/* </fieldset> */}



                    </div>
                </div>
                {/* <div className="second-screen-top-third-section">
                    <h7>Select Number Of Option</h7>
                    <div className='single-radio-input'>

                        {noOfOptions?.length > 0 && noOfOptions?.map((item, index) => {
                            return (<> <div className="input-box" key={index}>
                                <input type="radio" id={`options-${index}`} name="noOfOptions" value={item?.options} />
                                <label for={`options-${index}`}>{item?.options}</label><br />

                            </div></>)
                        })}



                    </div>
                </div> */}
            </div>

            <div className='third-screen-bottom'>
                <button className="" onClick={() => {
                    if (pollDetails?.correctOptions?.length == 0) {
                        toast.error("Select Correct Options")
                    } else {

                        createPoll()
                        toast.success('Poll Started')
                        // setTimeLeft(pollDetails?.duration)
                        setTimeout(() => {
                            toast.success('Poll Started')
                            setTimeLeft(pollDetails?.duration)
                        }, 1000)

                    }

                }} >
                    Start poll
                </button>
                <button className="" style={{ background: (timeLeft == -1 || (timeLeft !== 0 && timeLeft)) ? 'gray' : '#9603F2' }} onClick={() => {
                    if (timeLeft == -1 || (timeLeft !== 0 && timeLeft)) {
                        toast.error('Let the Poll End Please...')
                    }
                    else {
                        setScreens((prev) => ({ ...prev, third: false, fourth: true }))
                    }
                }}>
                    Show Result
                </button>
            </div>
        </div >
    )
}

export default ThirdScreen