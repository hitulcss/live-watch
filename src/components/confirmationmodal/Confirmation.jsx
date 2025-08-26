import Draggable from "react-draggable"
import './Confirmation.css'
import { useNavigate } from "react-router-dom"


const Confirmation = ({ setConfirmDisplay, lectureFromPanel }) => {


    const navigate = useNavigate()
    return (<>
        <Draggable>
            <div className="confirmation-conatiner">
                <h2>Exit?</h2>
                <div className="buttons">
                    <button onClick={() => {
                        navigate('/meet-end', {
                            state: {
                                lectureId: lectureFromPanel
                            }
                        })
                        window.location.reload()
                    }}>Yes</button>
                    <button onClick={() => setConfirmDisplay(false)}>No</button>
                </div>
                {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos earum aliquam veniam magni, nostrum ea incidunt vero consectetur aspernatur blanditiis repudiandae sapiente perferendis, ipsa ratione facere. Facere aperiam inventore maiores.</p> */}

            </div>
        </Draggable>
    </>)
}

export default Confirmation