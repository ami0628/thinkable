import Header from "../../components/Header/Header";
import Sidebar from "../../components/BoardSidebar/BoardSidebar";
import Board from "../../components/Board/Board";
import { useState } from "react";

import"./BoardPage.css";


type PinData = {
    noteId:string,
    title:string,
    position:{
        x:number,
        y:number
    }
}

function BoardPage (){
    const [pinnedNotes, setPinnedNotes] =useState<PinData[]>([])
    function addPinnedNote(pinData:PinData){setPinnedNotes(current => [...current, pinData])}
    function removePinnedNote(noteId:string){setPinnedNotes(current => current.filter(pinnedNote => pinnedNote.noteId !== noteId))}
    function updatePinnedNote(pinData:PinData){
        setPinnedNotes(current => current.map(pinnedNote => {
                if (pinData.noteId == pinnedNote.noteId) {return pinData}
                else {return pinnedNote}
    }))}

    return(
        <div>
            <Header/>
            <div className="board-layout">
                <Sidebar
                    pinnedNotes={pinnedNotes}
                    pinFunctions={{
                        addPinnedNote:addPinnedNote,
                        removePinnedNote:removePinnedNote,
                        updatePinnedNote:updatePinnedNote
                    }}
                />
                <Board
                    pinnedNotes={pinnedNotes}
                    pinFunctions={{
                        addPinnedNote:addPinnedNote,
                        removePinnedNote:removePinnedNote,
                        updatePinnedNote:updatePinnedNote
                    }}
                />
            </div>
        </div>
    );
}

export default BoardPage;