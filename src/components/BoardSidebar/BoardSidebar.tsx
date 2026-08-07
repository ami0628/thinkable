import "./BoardSidebar.css"
import {ChevronDown, ChevronRight, Settings, Brain, Search} from 'lucide-react';
import { useState } from "react";

type SidebarData = {
    noteId:string,
    title:string,
    position:{
        x:number,
        y:number
    }
}

type BoardSidebarProps = {
    pinnedNotes:SidebarData[]
    recentNotes:SidebarData[]
    sidebarFunctions:{
        addPinnedNote: (pinData:SidebarData) => void
        removePinnedNote: (noteId:string) => void
        updatePinnedNote: (pinData:SidebarData) => void
        updateRecentNotes: (recentData:SidebarData) => void
        removeRecentNote: (noteId:string) => void
    }
}

function BoardSidebar({ pinnedNotes, recentNotes, sidebarFunctions }:BoardSidebarProps){
    const [showPinnedList, setShowPinnedList] = useState(true);
    function toggleShowPinnedList(){ setShowPinnedList(!showPinnedList);}

    const [showRecents, setShowRecents] = useState(true);
    function toggleShowRecents(){ setShowRecents(!showRecents);}

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
                        <li className="no-select"
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
                        <li className="no-select"
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