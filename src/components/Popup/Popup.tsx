import "./Popup.css"

function Popup(props:any){

    let headingText = "";
    let contextText = "";
    let confirmText = "";

    if (props.action == "close"){
        headingText = "Close note?";
        contextText = "All unsaved changes will be lost.";
        confirmText = "Close";
    }

    if (props.action == "delete"){
        headingText = "Delete note?";
        contextText = "Deletion is permanent, note will be lost forever!";
        confirmText = "Delete";
    }

    if (props.action == "save"){
        headingText = "Save changes?";
        contextText = "Previous information will be overwritten.";
        confirmText = "Save";
    }



    return(
        <div className="overlay">
            <div className="popup">
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