import Draggable from 'react-draggable'
import './Resources.css'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';

const Resources = ({ lectureData, setResourceDisplay }) => {


    return (
        <Draggable>
            <div className="resources-conatiner">
                <CancelIcon className='modal-close-icon' onClick={() => setResourceDisplay(false)} />
                {lectureData?.length > 0 && lectureData[0].material?.fileName !== '' && <h2 className='resources-headings'>Resources</h2>}

                {lectureData?.map((item, index) => {
                    return (<>
                        {item?.material?.fileName !== '' && <div className="resources-box">

                            <span className='resources-title'>{item?.material?.fileName}</span>
                            <span className='pdf-download'><a href={item?.material?.fileLoc} style={{ color: 'black' }}><PictureAsPdfIcon className='pdf-download-icon' sx={{ fontSize: '30px' }} /></a></span>
                        </div>}

                    </>
                    )
                })}
                {lectureData?.length > 0 && lectureData[0].dpp?.fileName !== '' && < h3 className='resources-headings' style={{ marginTop: '20px' }}> Dpp</h3>}
                {lectureData?.map((item, index) => {
                    return (<>

                        {item?.dpp?.fileName !== '' && <div className="resources-box">

                            <span className='resources-title'>{item?.dpp?.fileName}</span>
                            <span className='pdf-download'><a href={item?.dpp?.fileLoc} style={{ color: 'black' }}><PictureAsPdfIcon className='pdf-download-icon' sx={{ fontSize: '30px' }} /></a></span>
                        </div>}
                    </>
                    )
                })}
                {/* {lectureData?.map((item, index) => {
                    return (
                        <div className="resources-box">

                            <span className='resources-title'>{item?.material?.fileName}</span>
                            <span className='pdf-download'><a href={item?.material?.fileLoc} style={{ color: 'black' }}><PictureAsPdfIcon className='pdf-download-icon' sx={{ fontSize: '30px' }} /></a></span>
                        </div>
                    )
                })} */}

            </div>
        </Draggable >
    )
}

export default Resources