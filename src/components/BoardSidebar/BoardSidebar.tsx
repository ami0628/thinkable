import "./BoardSidebar.css"
import {ChevronDown, Settings, Brain, Search} from 'lucide-react';

type PinData = {
    noteId:string,
    title:string,
    position:{
        x:number,
        y:number
    }
}

type BoardSidebarProps = {
    pinnedNotes:PinData[]
    pinFunctions:{
        addPinnedNote: (pinData:PinData) => void
        removePinnedNote: (noteId:string) => void
        updatePinnedNote: (pinData:PinData) => void
    }
}

function BoardSidebar({ pinnedNotes, pinFunctions }:BoardSidebarProps){
    return(
        <aside>
            <div className="sidebar-heading clickable"><Brain/> Boards </div>
            <div className="sidebar-heading clickable"><Search/> Search  </div>
            <div className="sidebar-heading clickable"><Settings/> Settings  </div>
            
            <br/>
            <div className="sidebar-heading clickable"> Pinned notes <ChevronDown /></div>
            <ul>
                {pinnedNotes &&
                    pinnedNotes.map(pinnedNote => (
                        <li 
                            key={pinnedNote.noteId}
                        >
                            {pinnedNote.title}
                        </li>
                    ))
                }
            </ul>
            <div className="sidebar-heading clickable"> Recent notes <ChevronDown /></div>
            <ul>
                <li>
                    example note 3
                </li>
                <li>
                    example note 4
                </li>
            </ul>
        </aside>
    );
}

export default BoardSidebar;