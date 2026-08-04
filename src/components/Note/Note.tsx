import { useState } from "react";
import "./Note.css"
import {PencilLine, Pin, PinOff, Ellipsis, Expand} from "lucide-react"

function Note(props: { data: any}){
    let [pinned,setPinned] = useState(false)
    const data = props.data

    function togglePinned(){
        setPinned(!pinned);
    }

    return(
        <div className="note">
            <div>
                {/* if data exists, use that, otherwise default */}
                <h3> {data.title ? data.title : "New Note" } <div className="icons"> <PencilLine className="icon"/> <Expand className="icon" />{!pinned? <Pin onClick={togglePinned} className="icon"/> : <PinOff onClick={togglePinned} className="icon"/>} <Ellipsis className="icon"/> </div></h3>
                <p> {data.content ? data.content : "Content will display here"} </p>
            </div>
        </div>
    )
}

export default Note;