import { calculateTimeAgo } from "../../utils/helpers"
import { useNavigate } from "react-router-dom"
import { Trash2, Ellipsis, Pencil } from "lucide-react";
import { useState } from "react";
import Popup from "../../components/Popup/Popup"
import { deleteBoard, renameBoard } from "../../store/boardStore";
import { createPortal } from "react-dom";
import "./BoardListItem.css"

type boardListItemProps = {
    id:string,
    noteCount:number,
    lastOpened:number,
    showDropdown:boolean,
    setShowDropdown: (id:string, value:boolean) => void,
    className:string
}


function BoardListItem(props:boardListItemProps){
    const navigate = useNavigate();

    type popupData = {
        action:"close" | "delete" | "save" | "create" | "rename",
        target:"note" | "board",
        data:{title:string}
    }
    const [popup, setPopup] = useState<popupData | null>(null)
    function handleDelete(){
        setPopup({action:"delete", target:"board", data:{title:props.id}})
    }

    function handleRename(){
        setPopup({action:"rename", target:"board", data:{title:props.id}})
    }

    return (
        <div className={`board-list-item ${props.showDropdown && "dropdown-visible "} ${props.className}`} onClick={() => {navigate(`/board/${props.id}`)}}>
            <p className="dashboard-card-title"> {props.id} </p>
            <Ellipsis className="ellipsis" onClick={(event) => {props.setShowDropdown(props.id,!props.showDropdown);event.stopPropagation()}}/>
            <div>
                <p className="dashboard-card-title"> {props.noteCount} notes </p>
                <p className="last-opened big"> Last opened: {calculateTimeAgo(props.lastOpened)} </p>
            </div>
            {props.showDropdown &&
            (<div className="dropdown" onClick={(event) => event.stopPropagation()}>
                <button onClick={handleRename}> <Pencil className="icon"/> Rename </button>
                <button onClick={handleDelete}> <Trash2 className="icon"/> Delete board </button>
            </div>)}
            {popup && createPortal(
                <Popup
                    action={popup.action}
                    target={"board"}
                    data={{title:props.id}}
                    cancel={() => setPopup(null)}
                    confirm={(newName) => {
                        if (popup.action=="rename"){renameBoard(props.id,newName)}
                        if (popup.action=="delete"){deleteBoard(props.id)}
                        setPopup(null);
                        props.setShowDropdown(props.id,false)
                    }}
                />,
                document.body             
            )
            }
        </div>       
    )
}

export default BoardListItem;



