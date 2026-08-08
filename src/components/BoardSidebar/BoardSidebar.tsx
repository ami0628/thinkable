import "./BoardSidebar.css"
import {ChevronDown, ChevronRight, Settings, Brain, Search} from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { useBoard, type SidebarData } from "../../context/BoardContext";

function BoardSidebar(){

    const {pinnedNotes, recentNotes, requestBoardAction} = useBoard();

    const [showPinnedList, setShowPinnedList] = useState(true);
    function toggleShowPinnedList(){ setShowPinnedList(!showPinnedList);}

    const [showRecents, setShowRecents] = useState(true);
    function toggleShowRecents(){ setShowRecents(!showRecents);}

    // create a timer, value is either (type of setTimeout's return) OR null
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // null value allows to check if the timer is running and cancel it

    function handleClick(noteData:SidebarData){
        // if there is a timer, interrupt timer and request to pan to the note
        if (clickTimer.current !== null){
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
            requestBoardAction({type:"pan", noteId:noteData.noteId})
        }   
        // if there is no timer (first click) --> start a timer
        else{
            // start a timer that, in 200ms, will open the note
            clickTimer.current = setTimeout(() => {requestBoardAction({type:"open", noteId:noteData.noteId}); clickTimer.current= null;},200);
        }
    }

    return(
        <aside>
            <div className="sidebar-heading clickable"><Brain/> Boards </div>
            <div className="sidebar-heading clickable"><Search/> Search  </div>
            <div className="sidebar-heading clickable"><Settings/> Settings  </div>
            
            <br/>
            <div className="sidebar-lists-container">
            <div className="sidebar-heading clickable no-select" onClick={toggleShowPinnedList}> Pinned notes {showPinnedList? <ChevronDown /> : <ChevronRight />}</div>
            <ul>
                {pinnedNotes && showPinnedList &&
                    pinnedNotes.map(pinnedNote => (
                        <li className="no-select" onClick={() => handleClick(pinnedNote)}
                            key={pinnedNote.noteId}
                        >
                            {pinnedNote.title}
                        </li>
                    ))
                }
            </ul>
            <div className="sidebar-heading clickable no-select" onClick={toggleShowRecents}> Recent notes {showRecents? <ChevronDown /> : <ChevronRight />}</div>
            {showRecents &&
            <ul>
                {recentNotes && showRecents &&
                    recentNotes.map(recentNote => (
                        <li className="no-select" onClick={() => handleClick(recentNote)}
                            key={recentNote.noteId}
                        >
                            {recentNote.title}
                        </li>
                    ))
                }
            </ul>}
            </div>
        </aside>
    );
}

export default BoardSidebar;