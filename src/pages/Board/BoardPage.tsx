import Header from "../../components/Header/Header";
import Sidebar from "../../components/BoardSidebar/BoardSidebar";
import Board from "../../components/Board/Board";
import { useState } from "react";

import"./BoardPage.css";


type SidebarData = {
    noteId:string,
    title:string,
    position:{
        x:number,
        y:number
    }
}

type BoardAction = {
    type: string, // open, pan
    noteId: string,
    position:{
        x: number,
        y: number
    }
}

function BoardPage (){
    // const [action,setAction] = useState<BoardAction|null>(null);


    // const [pinnedNotes, setPinnedNotes] =useState<SidebarData[]>([])
    // function addPinnedNote(pinData:SidebarData){setPinnedNotes(current => [...current, pinData])}
    // function removePinnedNote(noteId:string){setPinnedNotes(current => current.filter(pinnedNote => pinnedNote.noteId !== noteId))}
    // function updatePinnedNote(pinData:SidebarData){
    //     setPinnedNotes(current => current.map(pinnedNote => {
    //             if (pinData.noteId == pinnedNote.noteId) {return pinData}
    //             else {return pinnedNote}
    // }))}


    // const [recentNotes, setRecentNotes] = useState<SidebarData[]>([])
    // function updateRecentNotes(mostRecentData:SidebarData) {
    //     // notes => new note at head - previous notes filtered to see if new note was already there (if so, removed) - and only return the first 10
    //     setRecentNotes(current => [mostRecentData, ...current.filter(recentNote => recentNote.noteId !== mostRecentData.noteId)].slice(0,10))
    // }
    // function removeRecentNote(noteId:string){setRecentNotes(current => current.filter(recentNote => recentNote.noteId !== noteId))}



    return(
        <div>
            <Header/>
            <div className="board-layout">
                <Sidebar
                    pinnedNotes={pinnedNotes}
                    recentNotes={recentNotes}
                    sidebarFunctions={{
                        addPinnedNote:addPinnedNote,
                        removePinnedNote:removePinnedNote,
                        updatePinnedNote:updatePinnedNote,
                        updateRecentNotes:updateRecentNotes,
                        removeRecentNote:removeRecentNote
                    }}
                />
                <Board
                    pinnedNotes={pinnedNotes}
                    recentNotes={recentNotes}
                    sidebarFunctions={{
                        addPinnedNote:addPinnedNote,
                        removePinnedNote:removePinnedNote,
                        updatePinnedNote:updatePinnedNote,
                        updateRecentNotes:updateRecentNotes,
                        removeRecentNote:removeRecentNote
                    }}
                />
            </div>
        </div>
    );
}

export default BoardPage;