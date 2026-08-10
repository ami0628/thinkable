export type SavedNote = {
    id:string,
    type:string|undefined,
    position: {x:number, y:number}
    data: {
        title:string,
        text:string,
        width:number,
        height:number,
        expandedWidth:number,
        expandedHeight:number,
        pinned:boolean
    }
}

export type SidebarData = {
    noteId:string,
    title: string
}

export type SavedBoard = {
    notes: SavedNote[],
    pinnedNotes: SidebarData[],
    recentNotes: SidebarData[]
}

export function saveBoard(boardId:string, board: SavedBoard) {
    const json = JSON.stringify(board);
    localStorage.setItem(boardId, json)
    console.log(localStorage)
    console.log("saving")
}


export function loadBoard(boardId:string): SavedBoard | null{
    const json = localStorage.getItem(boardId)
    if (!json) {return null;}
    console.log("loading")
    return JSON.parse(json);
}