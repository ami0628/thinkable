import "./ExpandedNote.css"
import { X, Save } from "lucide-react";
import { useState } from "react";

function ExpandedNote (props:any){
    const data = props.data;

    const [title,setTitle] = useState(data.title ? data.title : "New Note");
    const [content, setContent] = useState(data.content ? data.content : "Content will display here");

    function handleExit(context:string) {data.onExit(props.id,data.originalId,{title, content},context)}
    
    return(
        <div className="expandedNote nowheel">
            <div className="expandedNoteHeader">
                <input className="titleInput nodrag" value={title} onChange={(event) => setTitle(event.target.value)}/>
                <div className="icons"> <Save className="icon" onClick={() => handleExit("save")}/> <X onClick={() => handleExit("close")} className="icon"/> </div>
            </div>
            <textarea className="contentInput nodrag" value={content} onChange={(event) => setContent(event.target.value)}/>
        </div>
    )
}

export default ExpandedNote