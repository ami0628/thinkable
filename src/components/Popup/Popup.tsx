import { loadBoard } from "../../store/boardStore"
import "./Popup.css"
import { Activity, useEffect, useRef, useState } from "react"

export type PopupProps = {
    action: "close" | "delete" | "save" | "create" |"rename"
    target: "note" | "board"
    data:{
        title: string | null
    }
    cancel: () => void
    confirm: (data:any) => void
}

function Popup(props:PopupProps){

    let headingText = "invalid arguments for popup creation";
    let contextText = "invalid arguments for popup creation";
    let confirmText = "invalid arguments for popup creation";

    if (props.action == "close" && props.target =="note"){
        headingText = "Close note?";
        contextText = "All unsaved changes will be lost.";
        confirmText = "Close";
    }

    if (props.action == "save" && props.target =="note"){
        headingText = "Save changes?";
        contextText = "Previous information will be overwritten.";
        confirmText = "Save";
    }

    if (props.action == "delete"){
        headingText = "Delete " + props.target + " '" + props.data.title + "'?";
        contextText = "Deletion is permanent, " + props.target + " will be lost forever!";
        confirmText = "Delete";
    }

    if (props.action == "create"){
        headingText = "Create a new Board";
        confirmText = "Create";
    }

    if (props.action == "rename"){
        headingText = "Rename " + props.target + " '" + props.data.title + "'?";
        confirmText = "Rename";
    }

    const [validBoardName, setValidBoardName] = useState(true)
    const [boardName, setBoardName] = useState((props.action == "rename" ? props.data.title : null) ?? "");

    function handleConfirm(){
        // if renaming, make sure id is valid first
        if (props.action == "rename" || props.action == "create"){
            if (loadBoard(boardName) !== null || boardName == "") {setValidBoardName(false)}
            else{ props.confirm(boardName)}
        }
        // otherwise, confirm as usual
        else {props.confirm(boardName)}
    }

    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {inputRef.current?.focus()},[inputRef.current])



    return(
        <div className="overlay" onClick={(event) => {event.stopPropagation(); props.cancel();}}>
            <div className={`popup ${props.action}`} onClick={(event) => event.stopPropagation()}>
                <p className="heading">{headingText}</p>
                <div className="text-container">
                    {props.action == "rename"|| props.action == "create"?
                    <p> <input ref={inputRef} className={`${!validBoardName && "warning"}`} value={boardName} onChange={(event) => {setBoardName(event.target.value); setValidBoardName(true)}}type="text" placeholder="Name"/></p>
                    : 
                    <p className="context">{contextText}</p>}
                    {props.action == "rename"|| props.action == "create" && !validBoardName && 
                    (boardName=="" ? <p className="warning-text"> Board name cannot be blank. </p> : <p className="warning-text"> A board with that name already exists. </p>)
                    }
                </div>
                <div className="buttons-container">
                    <button className="cancel" onClick={props.cancel}>Cancel</button>
                    <button className={props.action} onClick={handleConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}

export default Popup;