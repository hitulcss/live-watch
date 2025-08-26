//Imports

import './FilterSection.css';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from 'react';
import { Divider } from '@mui/material';

//Imports



const batchExampleArray = [
    {
        id: '1',
        batchName: 'Sainik', lecture: [
            { lectureId: '12', lectureName: 'lecture' },
            { lectureId: '12', lectureName: 'dynamic' },
            { lectureId: '12', lectureName: 'Room3' }
        ],
        rooms: [
            { roomName: 'lecture' },
            { roomName: 'dynamic' },
            { roomName: 'Room3' },
        ]
    },
    {
        id: '2',
        batchName: 'Police', lecture: [
            { lectureId: '12', lectureName: 'Room4' },
            { lectureId: '12', lectureName: 'Room5' },
            { lectureId: '12', lectureName: 'Room6' }
        ],
        rooms: [
            { roomName: 'Room1' },
            { roomName: 'Room2' },
            { roomName: 'Room3' },
        ]
    }
    ,
    {
        id: '3',
        batchName: 'Teaching',
        lecture: [

        ],
        // rooms: [
        //     { roomName: 'Room1' },
        //     { roomName: 'Room2' },
        //     { roomName: 'Room3' },
        // ]
    },
]

const FilterSection = ({ setSelectedFilter, setFilterOpen, roomNames, roomNamesFull, batchNames }) => {
    const [open, setOpen] = useState(false)
    const [openLecture, setOpenLecture] = useState(false)
    const [openRooms, setOpenRooms] = useState(false)
    const [selectedBatch, setSelectedBatch] = useState(-1)
    const [selectedLecture, setSelectedLecture] = useState(-1)
   
    return (
        <div className='filter-section-container' style={{ position: 'absolute' }}>

            <ul className='filter-batch-list'>

                <li style={{ color: "black" }}>Select Batch</li>

                <li className='filter-all-option'>
                    <span onClick={() => {
                        setSelectedFilter({ batch: 'All', lecture: roomNames, displayName: roomNamesFull?.map((item) => item?.roomName) })
                        setFilterOpen(false)
                    }
                    }>All</span>
                    {/* <span onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}> {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span> */}
                </li>

                {batchNames?.map((item, index) => {

                    return <li className='filter-batch-option' key={index} onClick={() => { }}>
                        <span onClick={() => setSelectedFilter((prev) => ({ batch: item, lecture: '', displayName: roomNamesFull?.map((item) => item?.roomName) }))}>{item}</span>
                        {roomNamesFull.length > 0 && <span onClick={() => {
                            setSelectedBatch(item?.id)

                            setOpen(!open)
                            setOpenLecture(!openLecture)
                        }} style={{ cursor: 'pointer' }}> {(open && item?.id == selectedBatch) ? <ArrowDropUpIcon onClick={() => setSelectedFilter((prev) => ({ batch: item, lecture: '', displayName: roomNamesFull?.map((item) => item?.roomName) }))} /> : <ArrowDropDownIcon onClick={() => setSelectedFilter((prev) => ({ batch: item, lecture: '', displayName: roomNamesFull?.map((item) => item?.roomName) }))} />}</span>
                        }
                        <div key={index} className="filter-lecture-list-container" style={{ display: (openLecture && item?.id == selectedBatch) ? '' : 'none' }}>

                            <li style={{ color: "black" }}>Select Room</li>

                            <li className='filter-all-option'>
                                <span onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedFilter((prev) => ({ ...prev, lecture: roomNames, displayName: roomNamesFull?.map((item) => item?.roomName) }))
                                    setFilterOpen(false)
                                }}>All</span>
                                {/* <span onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}> {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span> */}
                            </li>
                            {
                                roomNamesFull.map((lectureItem, index) => {

                                    return <ul className='filter-lecture-list'>

                                        <li className='filter-batch-option' key={index} onClick={(e) => {
                                            e.stopPropagation()
                                            setOpen(!open)
                                            setFilterOpen(false)
                                            setSelectedFilter((prev) => ({ ...prev, lecture: [lectureItem?.roomId], displayName: [lectureItem?.roomName] }))
                                        }}>
                                            {lectureItem?.roomName}
                                            {/* {item?.rooms?.length > 0 && <span onClick={() => {
                                            setSelectedBatch(item?.id)
                                            setOpen(!open)
                                            setSelectedLecture(lectureItem?.lectureId)
                                            // setOpenRooms(!openRooms)
                                        }} style={{ cursor: 'pointer' }}> {(!open && lectureItem?.lectureId == selectedLecture) ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>} */}

                                        </li>

                                    </ul>

                                })}
                        </div>



                    </li >
                })}

            </ul >
        </div >

    )
}

export default FilterSection