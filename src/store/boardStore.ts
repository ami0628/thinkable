export type SavedNote = {
    id:string,
    boardId:string,
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


function getSavedBoards() :SavedBoard[] | null{
    let savedBoardsJSON = localStorage.getItem("boards");
    if (savedBoardsJSON) {return JSON.parse(savedBoardsJSON);}
    else {return null}
}


export type SidebarData = {
    noteId:string,
    title: string,
    lastOpened: number
}

export type SavedBoard = {
    id:string,
    notes: SavedNote[],
    pinnedNotes: SidebarData[],
    recentNotes: SidebarData[],
    lastOpened: number
}

export function saveBoard(board: SavedBoard) {
    let savedBoards = getSavedBoards();
    if (!savedBoards) {savedBoards = []}

    if (!savedBoards.some(savedBoard => savedBoard.id == board.id)) {savedBoards = savedBoards.concat(board)}
    else{
        savedBoards = savedBoards.map(savedBoard => {
            if (board.id == savedBoard.id) {return board}
            else {return savedBoard}
        })
    }

    const json = JSON.stringify(savedBoards);

    localStorage.setItem("boards", json)
    console.log("saving")
}


export function loadBoard(boardId:string): SavedBoard | null{
    if (boardId=="") {return null;}
    const json = localStorage.getItem("boards")

    if (!json) {console.log("ERROR: no boards found"); return null;}
    console.log("loading")

    let savedBoards:SavedBoard[] = JSON.parse(json);
    const board = savedBoards.find(board => board.id == boardId);
    if (!board) {console.log("ERROR: no board found in list with matching id"); return null;}
    return board;
}

export function getMostRecentlyOpened() : {id:string, lastOpened:number} | null{
    let mostRecentBoard:{id:string, lastOpened:number} | null = null;
    let savedBoards:SavedBoard[] | null = getSavedBoards();
    if(!savedBoards) {console.log("no saved boards, (MRO function)"); return null;}

    savedBoards.forEach(board => {
        if (mostRecentBoard == null) {mostRecentBoard = {id:board.id, lastOpened:board.lastOpened}}
        else if (mostRecentBoard.lastOpened < board.lastOpened) {mostRecentBoard = {id:board.id, lastOpened:board.lastOpened}}
    }
    )

    return mostRecentBoard;
}

export function getAllBoardDetails() : {id:string, noteCount:number, lastOpened:number}[] | null{
    const savedBoards = getSavedBoards();
    if (!savedBoards) {return null}
    const boardDetails:{id:string, noteCount:number, lastOpened:number}[] = savedBoards.map(board => 
        {return{
            id:board.id,
            noteCount:board.notes.length,
            lastOpened:board.lastOpened
        }});
    boardDetails.sort((a,b) => b.lastOpened - a.lastOpened)
    return boardDetails;
}

export function getAllNotesOfType(type:string) :{boardId:string, noteId:string, title:string, lastOpened:number}[] | null {
    let allNotesOfType:{boardId:string, noteId:string, title:string, lastOpened:number}[] = []
    const savedBoards = getSavedBoards();
    let noteTypeList :SidebarData[] = []
    if(!savedBoards) {console.log("no saved boards: getallNotesOfType()"); return null;}
    savedBoards.forEach(board => {
        if (type == "recent") {noteTypeList = board.recentNotes}
        if (type == "pinned") {noteTypeList = board.pinnedNotes}
        allNotesOfType = [...allNotesOfType, ...noteTypeList.map(note => {
            return {boardId:board.id, noteId:note.noteId, title:note.title, lastOpened:note.lastOpened}
        })]
    })
    allNotesOfType.sort((a,b) => b.lastOpened - a.lastOpened)
    if (allNotesOfType) {return allNotesOfType;}
    return null
}


export function getAllNotes():SavedNote[]{
    const json = localStorage.getItem("boards");
    if (!json) {return [];}
    const savedBoards:SavedBoard[] = JSON.parse(json);

    // sets all boards to their array of notes and "flattens" together into one array
    return savedBoards.flatMap(board => board.notes)
}

export function deleteBoard(boardId:string){
    let savedBoards:SavedBoard[] | null = getSavedBoards()
    if (!savedBoards) {return}

    savedBoards = savedBoards.filter(board => board.id !== boardId)
    const json = JSON.stringify(savedBoards)

    localStorage.setItem("boards", json)
    console.log("deleting " + boardId)
}