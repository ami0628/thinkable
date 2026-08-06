import Header from "../../components/Header/Header";
import Sidebar from "../../components/BoardSidebar/BoardSidebar";
import Board from "../../components/Board/Board";
import { useState } from "react";

import"./BoardPage.css";


type PinData = {
    noteId:string,
    title:string,
    text:string
}

function BoardPage (){
    const [pinnedNotes, setPinnedNotes] =useState<PinData[]>([])

    function togglePinnedNote(pinData:PinData){
        setPinnedNotes(current => {
            const isPinned = current.some(note => note.noteId == pinData.noteId);
            // if note is already pinned, remove it
            if (isPinned) {return current.filter(note => note.noteId !== pinData.noteId);}
            // otherwise, add it
            else {return [...current, pinData];}}
        )
    }
    

    return(
        <div>
            <Header/>
            <div className="board-layout">
                <Sidebar/>
                <Board
                    pinnedNotes={pinnedNotes}
                    togglePinnedNote={togglePinnedNote}
                />
            </div>
        </div>
    );
}

export default BoardPage;