import { useState, useRef } from "react";
import "./Note.css"
import { Pin, PinOff, Ellipsis, Expand} from "lucide-react"
import { useReactFlow } from "@xyflow/react";

function Note(props:any){
    const [pinned,setPinned] = useState(false)
    const data = props.data

    function togglePinned() {setPinned(!pinned);}

    const resizing = useRef(false);
    const start = useRef({x:0, y:0, width:data.width, height:data.height});

    function startResize(event:React.MouseEvent){
        event.stopPropagation();
        event.preventDefault();

        resizing.current = true;

        start.current={
            // current mouse pos
            x:event.clientX,
            y:event.clientY,
            // current dimensions
            width:data.width,
            height:data.height
        };

        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
    }

    const { getZoom } = useReactFlow();

    function resize(event:MouseEvent){
        if(!resizing.current){return;}

        const zoom = getZoom();

        data.updateNoteSize(props.id, {
            // new width = current width + difference of current mousepos and last known mouse pos
            //divides by zoom to account for difference in pixel measurements
            width:start.current.width + ((event.clientX - start.current.x)/zoom),
            height:start.current.height + ((event.clientY - start.current.y)/zoom)
        })
    }

    function stopResize(){
        resizing.current=false
        window.removeEventListener("mousemove",resize)
        window.removeEventListener("mouseup",stopResize)
    }

    return(
        <div className="note nowheel" onDoubleClick={() => data.onExpand(props)} style={{width:data.width, height:data.height}}>
            <div>
                {/* if data exists, use that, otherwise default */}
                <h3> {data.title ? data.title : "New Note" } <div className="icons nodrag nopan"> <Expand onClick={(event) => {event.stopPropagation(); data.onExpand(props)}} className="icon nodrag nopan" />{!pinned? <Pin onClick={(event) => {event.stopPropagation(); togglePinned()}} className="icon"/> : <PinOff onClick={togglePinned} className="icon"/>} <Ellipsis className="icon"/> </div></h3>
                <p> {data.content ? data.content : "Content will display here"} </p>
            </div>
            <div className="resize-handle nodrag nopan" onMouseDown={startResize}> </div>
        </div>
    )
}

export default Note;