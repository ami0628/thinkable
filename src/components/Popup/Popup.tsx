import "./Popup.css"

function Popup(props:any){
    console.log("attempt to create popup with context " + props.action)

    let headingText = "";
    let contextText = "";
    let confirmText = "";

    if (props.action == "close"){
        console.log("close in if")
        headingText = "Close note?";
        contextText = "All unsaved changes will be lost.";
        confirmText = "Close";
    }

    if (props.action == "delete"){
        console.log("delete in if")
        headingText = "Delete note?";
        contextText = "Deletion is permanent, note will be lost forever!";
        confirmText = "Delete";
    }

    if (props.action == "save"){
        console.log("save in if")
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