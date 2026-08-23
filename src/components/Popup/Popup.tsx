import "./Popup.css"

export type PopupProps = {
    action: "close" | "delete" | "save"
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



    return(
        <div className="overlay" onClick={(event) => {event.stopPropagation(); props.cancel();}}>
            <div className="popup" onClick={(event) => event.stopPropagation()}>
                <div className="text-container">
                    <h3>{headingText}</h3>
                    <p>{contextText}</p>
                </div>
                <div className="buttons-container">
                    <button className="cancel" onClick={props.cancel}>Cancel</button>
                    <button className={props.action} onClick={props.confirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}

export default Popup;