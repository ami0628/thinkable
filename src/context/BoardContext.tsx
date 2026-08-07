import { createContext, useContext, useState, type ReactNode } from "react";

export type SidebarData = {
    noteId:string,
    title:string,
    position:{
        x:number,
        y:number
    }
}

export type BoardAction = {
    type: string, // open, pan
    noteId: string,
    position:{
        x: number,
        y: number
    }
}

type BoardContextValue = {
    pinnedNotes: SidebarData[]
    recentNotes: SidebarData[]

    addPinnedNote: (pinData:SidebarData) => void
    removePinnedNote: (noteId:string) => void
    updatePinnedNote: (pinData:SidebarData) => void

    updateRecentNotes: (pinData:SidebarData) => void
    removeRecentNote: (noteId:string) => void
    
    boardAction: BoardAction | null
    requestBoardAction: (action: BoardAction) => void
}

const BoardContext = createContext<BoardContextValue | null>(null)

type BoardProviderProps = {children: ReactNode}

export function BoardProvider({children}: BoardProviderProps) {
    

    const [boardAction,setBoardAction] = useState<BoardAction|null>(null);
            function requestBoardAction(action: BoardAction) {setBoardAction(action)}

    const [pinnedNotes, setPinnedNotes] =useState<SidebarData[]>([])
            function addPinnedNote(pinData:SidebarData){setPinnedNotes(current => [...current, pinData])}
            function removePinnedNote(noteId:string){setPinnedNotes(current => current.filter(pinnedNote => pinnedNote.noteId !== noteId))}
            function updatePinnedNote(pinData:SidebarData){
                setPinnedNotes(current => current.map(pinnedNote => {
                        if (pinData.noteId == pinnedNote.noteId) {return pinData}
                        else {return pinnedNote}
            }))}

    const [recentNotes, setRecentNotes] = useState<SidebarData[]>([])
            function updateRecentNotes(mostRecentData:SidebarData) {
                // notes => new note at head - previous notes filtered to see if new note was already there (if so, removed) - and only return the first 10
                setRecentNotes(current => [mostRecentData, ...current.filter(recentNote => recentNote.noteId !== mostRecentData.noteId)].slice(0,10))
            }
            function removeRecentNote(noteId:string){setRecentNotes(current => current.filter(recentNote => recentNote.noteId !== noteId))}


    return (
        // react component - makes context available to its descendants
        <BoardContext.Provider 
            value={{
                pinnedNotes,
                recentNotes,

                addPinnedNote,
                removePinnedNote,
                updatePinnedNote,

                updateRecentNotes,
                removeRecentNote,

                boardAction,
                requestBoardAction
            }}
        >
            {children}
        </BoardContext.Provider>
    )
         
}

export function useBoard() {
    const context = useContext(BoardContext);
    if (!context) {throw new Error("useBoard must be used within a BoardProvider")}
    return context;
}
