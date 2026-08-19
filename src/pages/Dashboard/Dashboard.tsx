import Header from "../../components/Header/Header";
import { loadBoard, getMostRecentlyOpened, getAllBoardDetails, getAllNotesOfType, getAllNotes } from "../../store/boardStore";
import "./Dashboard.css";
import { Search, SquarePlus, Brain, Clock, Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import type { SavedNote } from "../../store/boardStore";
import { calculateTimeAgo } from "../../utils/helpers";

function Dashboard (){

    const navigate = useNavigate();
    const [showCreateBoard,setShowCreateBoard] = useState(false);
    function toggleOverlay(){setShowCreateBoard(!showCreateBoard)}

    const [boardName, setBoardName] = useState("");
    const [validName, setValidName] = useState(true);

    const [showBoardMenu, setShowBoardMenu] = useState(false);
    function toggleBoardMenu(){setShowBoardMenu(!showBoardMenu)}

    useEffect(() => {
        if (!showCreateBoard) {setBoardName("")}
        if(showCreateBoard){window.addEventListener("click",toggleOverlay)}
        return () => window.removeEventListener("click", toggleOverlay)
    }, [showCreateBoard])

    useEffect(() => {
        if(showBoardMenu){window.addEventListener("click",toggleBoardMenu)}
        return () => window.removeEventListener("click", toggleBoardMenu)
    }, [showBoardMenu])


    const allPinnedNotes = getAllNotesOfType("pinned");
    const allRecentNotes = getAllNotesOfType("recent");

    const mostRecentBoard = getMostRecentlyOpened();

    function createBoard(){
        if (loadBoard(boardName) == null) {navigate("/board/" + boardName.toString());}
        else {setValidName(false);}
    }

    const [searching,setSearching] = useState(false);

    const allBoardDetails:{id:string, noteCount:number, lastOpened:number}[] | null = getAllBoardDetails();
    const excessBoards = allBoardDetails ? allBoardDetails.length > 4 : false;
    const boardsToList = excessBoards ? allBoardDetails?.slice(0,3) : allBoardDetails

    const [titleMatches,setTitleMatches] = useState<SavedNote[]>([])
    const [textMatches,setTextMatches] = useState<SavedNote[]>([])

    function searchNotes(searchText:string){
        setTitleMatches([])
        setTextMatches([])
        if (searchText == ""){return;}

        let savedNotes:SavedNote[] = getAllNotes();
        if (!savedNotes) return
        
        const titleMatchesLocal:SavedNote[] = []
        const textMatchesLocal:SavedNote[] = []
        
        savedNotes.forEach(note => {
            if (note.data.title.toLowerCase().includes(searchText.toLowerCase())) {titleMatchesLocal.push(note)}
            if (note.data.text.toLowerCase().includes(searchText.toLowerCase())) {textMatchesLocal.push(note)}
        })
        
        setTitleMatches(sortNotesBySearchRelevance(titleMatchesLocal, "title", searchText.toLowerCase()));
        setTextMatches(sortNotesBySearchRelevance(textMatchesLocal, "text", searchText.toLowerCase()));
    }

    function sortNotesBySearchRelevance(noteList:SavedNote[], noteType:string, searchText: string):SavedNote[]{
        let noteListWithScore:{note:SavedNote, score:number}[] = []
        noteListWithScore = noteList.map(note => {
            let stringToCompare = ""
            if (noteType == "title") {stringToCompare = note.data.title.toLowerCase()}
            else {stringToCompare = note.data.text.toLowerCase()}

            if (stringToCompare == searchText) {return {note:note, score:3}}
            if (stringToCompare.startsWith(searchText)) {return {note:note, score:2}}
            else {return {note:note, score:1}}
        })

        noteListWithScore.sort((a,b) => b.score - a.score)

        return noteListWithScore.map(noteAndScore => {return noteAndScore.note})
    }

    return(
        <div>
            <Header></Header>
            <div className="body-container">
                <div className="dashboard-container">
                    <div className="search-heading">
                        <h3 className="dashboard-heading"> Good evening, Alexander </h3>
                        <div className="search-container">
                            <Search/>
                            <input type="text" className="search" placeholder="Search notes" onChange={(event) => searchNotes(event.target.value)} onFocus={() => setSearching(true)} onBlur={() => setSearching(false)}></input>
                            {searching && (titleMatches.length > 0 || textMatches.length > 0) &&
                                <div className="search-dropdown" onClick={(event) => event.preventDefault()}>
                                    {titleMatches.length > 0 && <div className="search-matches">
                                        <div className="search-dropdown-heading"> Title matches: </div>
                                        { titleMatches &&
                                            titleMatches.map(note => (
                                                <div key={note.id} className="search-result" onMouseDown={(event) => {event.preventDefault();navigate(`/board/${note.boardId}?note=${note.id}`)}}>
                                                    <p className="search-result-title"> {note.data.title} </p>
                                                    <div className="search-result-text-preview"/> {/* keeps styling consistent */}
                                                    <p className="search-result-board"> Board: {note.boardId} </p>
                                                </div>
                                            ))

                                        }
                                    </div>}
                                    
                                    {textMatches.length > 0 && <div className="search-matches">
                                        <div className="search-dropdown-heading"> Text matches: </div>
                                        { textMatches &&
                                            textMatches.map(note => (
                                                <div key={note.id} className="search-result" onMouseDown={(event) => {event.preventDefault();navigate(`/board/${note.boardId}?note=${note.id}`)}}>
                                                    <p className="search-result-title"> {note.data.title} </p>
                                                    <p className="search-result-text-preview"> {note.data.text.length > 128? note.data.text.slice(0,128)+"..." : note.data.text}</p>
                                                    <p className="search-result-board"> Board: {note.boardId} </p>
                                                </div>
                                            ))

                                        }
                                    </div>}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="board-choices-big">
                        <div className="dashboard-card big" onClick={(event) => {event.stopPropagation(); toggleOverlay();}}>
                            <p> New board </p>
                            <SquarePlus className="icon"/>
                            <p> Start thinking with a blank canvas. </p>
                        </div>
                        {mostRecentBoard && 
                            <div className="dashboard-card big" onClick={() => navigate(`/board/${mostRecentBoard?.id}`)}>
                                <p> Continue thinking... </p>
                                <Brain className="icon"/>
                                <div>
                                    <p className="dashboard-card-title"> {mostRecentBoard !== null ? mostRecentBoard.id : "test"} </p>
                                    <p className="last-opened big"> Last opened: {mostRecentBoard !== null ? calculateTimeAgo(mostRecentBoard.lastOpened) : "test"}. </p>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="your-boards-container">
                        <h4> Your boards:</h4>
                        <hr></hr>
                        <div className="board-choices-container">
                        <div className="board-choices">
                            {!allBoardDetails &&
                                <div className="dashboard-card small center-text">
                                    <p className="dashboard-card-title"> Your boards will show up here. </p>
                                </div>}
                            {!allBoardDetails &&
                                <div className="dashboard-card small center-text">
                                    <p className="dashboard-card-title"> Create a board to get started!</p>
                                </div>}
                            {allBoardDetails && boardsToList &&
                                boardsToList.map(board => {return(
                                    <div  key={board.id} className="dashboard-card small" onClick={() => navigate(`/board/${board.id}`)}>
                                        <p className="dashboard-card-title"> {board.id} </p>
                                        <div>
                                        <p className="dashboard-card-title"> {board.noteCount} notes </p>
                                        <p className="last-opened big"> Last opened: {calculateTimeAgo(board.lastOpened)} </p>
                                        </div> 
                                    </div>
                                )})
                            }
                            {allBoardDetails && excessBoards &&
                                <div className="dashboard-card small center-text" onClick={(event) => {event.stopPropagation(); toggleBoardMenu()}}>
                                    <p className="dashboard-card-title"> More boards... </p>
                                </div>
                            }
                        </div>
                        </div>
                    </div>
                    <div className="pinned-recents-container">
                        <div className="pinned-container">
                            <h4>Pinned notes: <Pin/></h4>
                            <hr></hr>
                            <div className="pins">
                                {allPinnedNotes && allPinnedNotes.map(note => (
                                    <div  key={note.noteId}  className="dashboard-card dashboard-note pin" onClick={() => navigate(`/board/${note.boardId}?note=${note.noteId}`)}>
                                        <p className="dashboard-note-title"> {note.title} </p>
                                        <p className="dashboard-note-details"> Board: {note.boardId}</p>
                                        <p className="dashboard-note-details">Last accessed: {calculateTimeAgo(note.lastOpened)}</p>
                                    </div>
                                ))}
                                {!allPinnedNotes &&
                                    <div className="dashboard-card dashboard-note pin">
                                        <p className="dashboard-note-title"> Pinned notes will appear here. </p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="recents-container">
                            <h4>Recents: <Clock/></h4>
                            <hr></hr>
                            <div className="recents">
                                {allRecentNotes && allRecentNotes.map(note => (
                                    <div  key={note.noteId} className="dashboard-card dashboard-note" onClick={() => navigate(`/board/${note.boardId}?note=${note.noteId}`)}>
                                        <p className="dashboard-note-title"> {note.title} </p>
                                        <p className="dashboard-note-details"> Board: {note.boardId}</p>
                                        <p className="dashboard-note-details">Last accessed: {calculateTimeAgo(note.lastOpened)}</p>
                                    </div>
                                ))}
                                {!allRecentNotes &&
                                    <div className="dashboard-card dashboard-note pin">
                                        <p className="dashboard-note-title"> Recent notes will appear here. </p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {showCreateBoard && 
                <div className="dashboard-popup-overlay">
                    <div className="create-board-card" onClick={(event) => event.stopPropagation()}>
                        <div className="create-board">
                            <p className="create-board-title"> Create a new Board </p>
                            <div className="input-warning-container">
                            <input className={`${!validName && "warning"}`} value={boardName} onChange={(event) => {setBoardName(event.target.value); setValidName(true)}}type="text" placeholder="Name"/>
                            {!validName && <p className="warning-text"> A board with that name already exists. </p>} 
                            </div>
                            <div className="create-board-buttons">
                                <button className="button cancel" onClick={toggleOverlay}> Cancel </button>
                                <button className="button create" onClick={createBoard}> Create </button>
                            </div>
                        </div>
                    </div> 
                </div>
                }
                {showBoardMenu && 
                <div className="dashboard-popup-overlay">
                    <div className="board-menu-card" onClick={(event) => event.stopPropagation()}>
                        <div className="board-menu">
                            <div className="board-menu-heading">  Saved boards </div>
                            <div className="board-menu-body">

                                {allBoardDetails &&
                                    allBoardDetails.map(board => (
                                        <div  key={board.id} className="dashboard-card small" onClick={() => {navigate(`/board/${board.id}`)}}>
                                            <p className="dashboard-card-title"> {board.id} </p>
                                            <div>
                                            <p className="dashboard-card-title"> {board.noteCount} notes </p>
                                            <p className="last-opened big"> Last opened: {calculateTimeAgo(board.lastOpened)} </p>
                                            </div> 
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div> 
                </div>
                }
            </div>
        </div>
    );
}

export default Dashboard;