import { useState } from "react";
import "./Note.css"
import {PencilLine, Pin, PinOff, Ellipsis, Expand} from "lucide-react"

function Note(props:any){
    const [pinned,setPinned] = useState(false)
    const data = props.data

    function togglePinned(){
        setPinned(!pinned);
    }

    return(
        <div className="note nowheel">
            <div>
                {/* if data exists, use that, otherwise default */}
                <h3> {data.title ? data.title : "New Note" } <div className="icons nodrag nopan"> <Expand onClick={(event) => {event.stopPropagation(); data.onExpand(props)}} className="icon nodrag nopan" />{!pinned? <Pin onClick={(event) => {event.stopPropagation(); togglePinned()}} className="icon"/> : <PinOff onClick={togglePinned} className="icon"/>} <Ellipsis className="icon"/> </div></h3>
                <p> {data.content ? data.content : "Content will display here"} </p>
            </div>
        </div>
    )
}

export default Note;