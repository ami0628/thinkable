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

const BOARD_STORAGE_KEY = "thinkable-board";
export function saveBoard(board: SavedBoard) {
    const json = JSON.stringify(board);
    localStorage.setItem(BOARD_STORAGE_KEY, json)
    console.log("saving")
}


export function loadBoard(): SavedBoard | null{
    const json = localStorage.getItem(BOARD_STORAGE_KEY)
    if (!json) {return null;}
    console.log("loading")
    return JSON.parse(json);
}