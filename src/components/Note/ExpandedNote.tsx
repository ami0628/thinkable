import "./ExpandedNote.css"
import { X, Save } from "lucide-react";

function ExpandedNote (props:any){
    const data = props.data;
    return(
        <div className="expandedNote nowheel">
            <div className="expandedNoteHeader">
                <input className="titleInput nodrag" defaultValue={data.title ? data.title : "New Note" }/>
                <div className="icons"> <Save className="icon"/> <X className="icon"/> </div>
            </div>
            <textarea className="contentInput nodrag" defaultValue={data.content ? data.content : "Content will display here"}/>
        </div>
    )
}

export default ExpandedNote