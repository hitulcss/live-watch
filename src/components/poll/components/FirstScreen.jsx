import './FirstScreen.css'

const FirstScreen = ({ setScreens, setPollDetails }) => {
    return (

        <div className="first-screen-container">

            <div className="first-screen-mid">
                <svg width="120" height="120" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="75" cy="75" r="75" fill="#F2ECFF" />
                    <path d="M45 105V100.138H105V105H45ZM60.3037 92.7194V45H68.2591V92.7194H60.3037ZM81.7409 92.7194V64.4495H89.6963V92.7194H81.7409Z" fill="#333333" />
                </svg>
                <div className='first-screen-mid-text'>
                    <p>
                        There are no polls in the live class yet.
                    </p>
                    <p>
                        Start a poll here!
                    </p>
                </div>


            </div>

            <div className='first-screen-bottom'>
                <button className="" onClick={() => setScreens((prev) => ({ ...prev, first: false, second: true }))}>
                    Create a poll

                </button>
            </div>
        </div >
    )
}

export default FirstScreen