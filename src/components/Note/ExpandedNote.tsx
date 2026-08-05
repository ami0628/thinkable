import "./ExpandedNote.css"
import { X, Save } from "lucide-react";
import { useState } from "react";

function ExpandedNote (props:any){
    const data = props.data;
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({x:0, y:0});

    function startDrag(event:React.MouseEvent){
        setDragging(true);
        setOffset({
            // offset makes it so that you drag the part you click, instead of top-left
            // mouse location - note location
            x:event.clientX - data.position.x,
            y:event.clientY - data.position.y
        })
    }

    function drag(event:React.MouseEvent){
        if(!dragging) {return;}
        props.updatePosition(
            data.noteId,
            {
                x:event.clientX - offset.x,
                y:event.clientY - offset.y
            }
        )
    }

    function stopDrag(){
        setDragging(false);
    }

    const [title,setTitle] = useState(data.title ? data.title : "New Note");
    const [content, setContent] = useState(data.content ? data.content : "Content will display here");

    function handleExit(context:string) {props.onExit(data.noteId,{title, content},context)}
    
    return(
        <div className="expandedNote nowheel" style={{left:data.position.x, top:data.position.y}} onMouseDown={startDrag} onMouseUp={stopDrag} onMouseMove={drag}>
            <div className="expandedNoteHeader">
                <input className="titleInput nodrag" value={title} onChange={(event) => setTitle(event.target.value)} onMouseDown={(event)=>event.stopPropagation()} />
                <div className="icons"> <Save className="icon" onClick={() => handleExit("save")} onMouseDown={(event)=>event.stopPropagation()}/> <X onClick={() => handleExit("close")} className="icon" onMouseDown={(event)=>event.stopPropagation()}/> </div>
            </div>
            <textarea className="contentInput nodrag" value={content} onChange={(event) => setContent(event.target.value)} onMouseDown={(event)=>event.stopPropagation()}/>
        </div>
    )
}

export default ExpandedNote