import Draggable from 'react-draggable'
import './Info.css'
import CancelIcon from '@mui/icons-material/Cancel';

const Info = ({ lectureData, setInfoDisplay }) => {
   
    return (
        <Draggable>

            <div className="info-conatiner">
                <CancelIcon className='modal-close-icon' onClick={() => setInfoDisplay(false)} />
                <h2>Info</h2>
                {/* <div dangerouslySetInnerHTML={{ _html: lectureData[0]?.description }} /> */}
                <div
                    dangerouslySetInnerHTML={{ __html: lectureData[0]?.description }}
                />
                {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos earum aliquam veniam magni, nostrum ea incidunt vero consectetur aspernatur blanditiis repudiandae sapiente perferendis, ipsa ratione facere. Facere aperiam inventore maiores.</p> */}

            </div>
        </Draggable>
    )
}

export default Info