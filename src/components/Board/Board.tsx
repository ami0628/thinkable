import "./Board.css"
import { ReactFlow, Controls, Background, applyNodeChanges, useReactFlow } from "@xyflow/react"
import type {Node} from "@xyflow/react"
import "@xyflow/react/dist/style.css";
import Note from "../Note/Note";
import ExpandedNote from "../Note/ExpandedNote"
import Popup from "../Popup/Popup";
import { useEffect, useState, useRef } from "react"
import { useBoard } from "../../context/BoardContext";
import { saveBoard, loadBoard } from "../../store/boardStore";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

const nodeTypes = {
    note: Note,
};

type NoteData = {
    title: string,
    text: string,
    width:number,
    height:number,
    expandedWidth:number,
    expandedHeight:number,
    pinned:boolean,
    lastOpened:number,
    onExpand: (data:any) => void,
    updateNoteSize: (id:string, size:{width:number, height:number}) => void,
    removeNode: (id:string) => void,
    requestPopup:(action:"close"|"delete"|"save", noteId:string) => void,
}

type ExpandedWindow = {
    noteId: string,
    title:string,
    text:string,
    width: number,
    height: number,
    position:{
        x:number,
        y:number
    }
}

type BoardProps = {
    boardId:string
    noteToPanTo:string | null
}

type BoardNode = Node<NoteData>

function Board(props:BoardProps){
    const [nodes, setNodes] = useState<BoardNode[]>([]);
    const [expandedNotes, setExpandedNotes] = useState<ExpandedWindow[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const {
        pinnedNotes,
        recentNotes,
        addPinnedNote,
        removePinnedNote,
        updatePinnedNote,
        updateRecentNotes,
        removeRecentNote,
        boardAction,
        resetBoardAction,
        loadRecentNotes,
        loadPinnedNotes
    } = useBoard()

    useEffect(() => {
        console.log(boardAction)
        if (boardAction !== null) {
            if (boardAction.type === "clear"){setNodes([]); loadPinnedNotes([]); loadRecentNotes([]);}
            if (boardAction.type === "search") {toggleSearchBar();console.log("showSearchBar:" + showSearchBar)}
            const noteToActOn = nodes.find(note => note.id == boardAction.noteId)
            if (!noteToActOn) {resetBoardAction(); return}
            if (boardAction.type === "open"){onExpand(noteToActOn);}
            if (boardAction.type === "pan"){panTo(noteToActOn.id,"animate")}
            resetBoardAction()
        }
    },[boardAction])

    function panTo(noteId:string, type:string){
        const noteToActOn = nodes.find(note => note.id == noteId)
        if (!noteToActOn) {return;}

        let centerPosX = noteToActOn.position.x;
        const width = noteToActOn.measured?.width ?? noteToActOn.data.width
        if (noteToActOn.data.width) {centerPosX += width/2}

        let centerPosY = noteToActOn.position.y;
        const height = noteToActOn.measured?.height ?? noteToActOn.data.height
        if (noteToActOn.data.height) {centerPosY += height/2}

        if (type == "snap") {setCenter(centerPosX, centerPosY, {zoom:1.2});}
        else {setCenter(centerPosX, centerPosY, {zoom:1.2, duration:1000});}
    }

    // if pinned notes changes, make sure all notes are correctly pinned/unpinned
    useEffect(()=>{
        setNodes(current =>{
            let changed=false; // only change when necessary, avoid feedback loop
            const newArray = current.map( note =>{
                const shouldBePinned = pinnedNotes.some(pinnedNote => pinnedNote.noteId == note.id)
                // should and is, shouldnt and isn't --> no change
                if (note.data.pinned === shouldBePinned) {return note}
                else {changed=true; return {...note, data:{...note.data, pinned:shouldBePinned}}}
            })
            return changed ? newArray : current
        })
    },[pinnedNotes])

    useEffect(() => {  
        // update pinnedNote data when any note data changes
        pinnedNotes.forEach(pinnedNote => {
            // for every pinnedNote
            nodes.map(note => {
                // update with newest data of corresponding note
                if (pinnedNote.noteId == note.id && pinnedNote.title !== note.data.title) {updatePinnedNote({noteId:pinnedNote.noteId, title:note.data.title, lastOpened:Date.now()})}
            })
        })

        recentNotes.forEach(recentNote =>{
            nodes.map(note => {
                if (recentNote.noteId == note.id && recentNote.title !== note.data.title) {updateRecentNotes({noteId:recentNote.noteId, title:note.data.title, lastOpened:Date.now()})}
            })
        })

    },[nodes])

    useEffect(() =>{saveCurrentBoard()},[nodes,recentNotes])

    function updateNodeData(id: string, newData:any, context:string){
        if (context=="save"){
            newData = {
                title:newData.title,
                text:newData.text,
                expandedWidth:newData.expandedWidth,
                expandedHeight:newData.expandedHeight
            }
        }
        else{ // close
            newData = {
                expandedWidth:newData.expandedWidth,
                expandedHeight:newData.expandedHeight
            }
        }
        setNodes(
            // go through all nodes
            // map(x => y) means "replace each x with y", here y is an expression
            currentNodes => currentNodes.map(node => 
                // if node matches id
                node.id === id ? {
                    // replaces node's data with new data
                    ...node, data:{...node.data, ...newData}
                } :
                //otherwise, returns the original node
                node
            )
        );
    }

    function removeNode(id:string) {
        setNodes(currentNodes => currentNodes.filter(node => node.id !== id))
        removePinnedNote(id);
        removeRecentNote(id);
    }

    function handleNodeChanges(changes:any) {
        setNodes((nodes) => applyNodeChanges(changes, nodes))
    }

    // useReactFlow returns several helper functions, picking one to use
    const { screenToFlowPosition, setCenter, fitView } = useReactFlow();
    

    const lastClick = useRef(0);

    function handleClick(data: { clientX: any; clientY: any; }){
        if (Date.now() - lastClick.current <= 250){ handleDoubleClick(data); }
        lastClick.current = Date.now();
        return
    }

    function handleDoubleClick(data: { clientX: any; clientY: any; }){
        // convert screen cursor positions into positions within the flow
        // screenToFlowPosition takes two coords and returns two coords - set position to result of func
        let position = screenToFlowPosition({
            x:data.clientX,
            y:data.clientY
        });
        position = {
            x:position.x - 100,
            y:position.y - 75
        }

        // create new note and add to end of note list
        const newNote = {
            id:crypto.randomUUID(),
            type:"note",
            position:{
                x:position.x,
                y:position.y
            },
            data:{
                title:"New note",
                text:"Text will display here.",
                width:200,
                height:150,
                expandedWidth:400,
                expandedHeight:400,
                pinned:false,
                lastOpened:Date.now(),

                onExpand,
                updateNoteSize,
                removeNode,
                requestPopup,
            }
        }
        setNodes(currentItems =>[...currentItems, newNote])
    }

    function onExpand(noteProps:any){
        const noteData = noteProps.data;
        const newExpandedNote = {
            noteId: noteProps.id,
            title: noteData.title,
            text: noteData.text,            
            width: noteData.expandedWidth ?? 400,
            height: noteData.expandedHeight ?? 400,
            position:getCenterOfView()
        }
        // function inside - gives latest version of data
        // ... turns     ...arrayA, x --> a,b,c,x    where arrayA = [a,b,c]  SPREAD
        setExpandedNotes(current =>{
            // is there some note with the same id as the one we are opening
            const alreadyOpen = current.some(note => note.noteId == noteProps.id);
            //yes, return array as is
            if (alreadyOpen) {return current;}
            //no, add node and return
            return([...current, newExpandedNote])
        }
        );
        updateRecentNotes({noteId:noteProps.id, title:noteData.title, lastOpened: Date.now()})
        updatePinnedNote({noteId:noteProps.id, title:noteData.title, lastOpened:Date.now()})
    }

    function getCenterOfView(){
        const center = {
            x: (window.innerWidth / 2) - 250,
            y: 80
        }
        return center
    }

    function onExit(noteId:string, data:any, context:string){
        updateNodeData(noteId, data, context);
        // list of EN becomes the result of: [allow all notes where noteId is not the one being deleted]
        setExpandedNotes( current => current.filter(note => note.noteId !== noteId))
    }

    function updateExpandedNotePosition(noteId:string, position:{x:number, y:number}){
        setExpandedNotes(current =>
            current.map(note =>
                // if note is the one being dragged, update position,    (spread used like this updates the position as key cannot exist twice)
                {if (note.noteId == noteId) {return {...note, position:position}}
                //otherwise, return unchanged
                else {return note;}}
            )
        );
    }

    function updateExpandedNoteSize(noteId:string, size:{width:number, height:number}){
        setExpandedNotes(current =>
            current.map(note => { 
                if (note.noteId == noteId) { return {...note, ...size}}
                else {return note}
            })
        )
    }

    function updateNoteSize(noteId:string, size:{width:number,height:number}){
        // node list becomes...
        setNodes(current =>
            // the list of 'each note becomes'...
            current.map( note =>
                {
                    // either its updated self
                    if (note.id == noteId){
                        // all note params where data is replaced by
                        // {all data params, with size params replaced}
                        return {...note, data:{...note.data, ...size}};
                    }
                    // or original self
                    else {return note;}
                }
            )
        )
    }

    // enforce strict typing (not really important here)
    type Popup = {action: "close" | "delete" | "save", noteId:string, data?:any};
    const [popup, setPopup] = useState<Popup | null>(null);

    function requestPopup(action: "close" | "delete" | "save", noteId:string, data?:any){
        setPopup({action, noteId, data})
    }

    // on initial render, load board
    useEffect(() => {
        loadCurrentBoard()
        setHasLoaded(true)
    }, [])

    useEffect(() => {
        if (props.noteToPanTo) {panTo(props.noteToPanTo,"snap")}
    },[hasLoaded])

    function saveCurrentBoard(){
        if (!hasLoaded) {return}
        // convert board into persistent data

        // board data is now an object of (all relevant note data, and the list of recentNotes)
        const boardData = {
            id: props.boardId,
            notes: nodes.map(note => ({
                id:note.id,
                boardId:props.boardId,
                type: note.type,
                position:note.position,
                data:{
                    title: note.data.title,
                    text: note.data.text,
                    width: note.data.width,
                    height: note.data.height,
                    expandedWidth: note.data.expandedWidth,
                    expandedHeight: note.data.expandedHeight,
                    pinned: note.data.pinned
                }
            })),
            recentNotes,
            pinnedNotes,
            lastOpened: Date.now()
        }

        saveBoard(boardData)


    }

    function loadCurrentBoard(){

        const boardData = loadBoard(props.boardId)
        if (boardData === null) {return}

        const noteList = boardData.notes.map((note: any) => ({
            ...note,
            data: {
                ...note.data,
                onExpand,
                updateNoteSize,
                removeNode,
                requestPopup
            }
        }));
        setNodes(noteList);
        loadRecentNotes(boardData.recentNotes);
        loadPinnedNotes(boardData.pinnedNotes);
        if (!props.noteToPanTo) {fitView()}
         
    }

    // SEARCH DATA / FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////
    const [showSearchBar, setShowSearchBar] = useState(false)
    function toggleSearchBar(){setShowSearchBar(!showSearchBar); setTitleMatches([]); setTextMatches([])}

    const [searching,setSearching] = useState(false);

    const [titleMatches,setTitleMatches] = useState<BoardNode[]>([])
    const [textMatches,setTextMatches] = useState<BoardNode[]>([])

    function searchNotes(searchText:string){
        setTitleMatches([])
        setTextMatches([])
        if (searchText == ""){return;}

        if (!nodes) return
        
        const titleMatchesLocal:BoardNode[] = []
        const textMatchesLocal:BoardNode[] = []
        
        nodes.forEach(note => {
            if (note.data.title.toLowerCase().includes(searchText.toLowerCase())) {titleMatchesLocal.push(note)}
            if (note.data.text.toLowerCase().includes(searchText.toLowerCase())) {textMatchesLocal.push(note)}
        })
        
        setTitleMatches(sortNotesBySearchRelevance(titleMatchesLocal, "title", searchText.toLowerCase()));
        setTextMatches(sortNotesBySearchRelevance(textMatchesLocal, "text", searchText.toLowerCase()));
    }

    function sortNotesBySearchRelevance(noteList:BoardNode[], noteType:string, searchText: string):BoardNode[]{
        let noteListWithScore:{note:BoardNode, score:number}[] = []
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

    // END OF SEARCH DATA / FUNCTIONS /////////////////////////////////////////////////////////////////////////////////

    return(
        <main className="board-container">
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes} nodesDraggable={true} minZoom={0.1} maxZoom={8} zoomOnDoubleClick={false}
            onNodesChange={handleNodeChanges} onPaneClick={handleClick} >
                <Background/>
                <Controls />
            </ReactFlow>
            {popup &&
                <Popup
                    action = {popup.action}
                    cancel = { () => {setPopup(null);} }
                    confirm = {() => {
                        if (popup.action === "delete"){removeNode(popup.noteId)}
                        if (popup.action === "close") {onExit(popup.noteId, {...popup.data}, "close")}
                        if (popup.action === "save") {onExit(popup.noteId, {...popup.data}, "save")}
                        setPopup(null);
                    }}
                />
            }
            {expandedNotes.map(note =>
                <ExpandedNote
                    key={note.noteId}
                    data={note}
                    onExit={onExit}
                    updatePosition={updateExpandedNotePosition}
                    updateSize={updateExpandedNoteSize}
                    requestPopup={requestPopup}
                />
            )}
            { showSearchBar &&
            <div className="board-search-container">
                <Search/>
                <input type="text" className="search" placeholder="Search notes" onChange={(event) => searchNotes(event.target.value)} onFocus={() => setSearching(true)} onBlur={() => setSearching(false)}></input>
                <X className="close-icon" onClick={toggleSearchBar}/>
                {searching && (titleMatches.length > 0 || textMatches.length > 0) &&
                    <div className="search-dropdown" onClick={(event) => event.preventDefault()}>
                        {titleMatches.length > 0 && <div className="search-matches">
                            <div className="search-dropdown-heading"> Title matches: </div>
                            { titleMatches &&
                                titleMatches.map(note => (
                                    <div className="search-result" onMouseDown={(event) => {event.preventDefault(); panTo(note.id,"animate")}}>
                                        <p className="search-result-title"> {note.data.title} </p>
                                    </div>
                                ))

                            }
                        </div>}
                        
                        {textMatches.length > 0 && <div className="search-matches">
                            <div className="search-dropdown-heading"> Text matches: </div>
                            { textMatches &&
                                textMatches.map(note => (
                                    <div className="search-result"  onMouseDown={(event) => {event.preventDefault(); panTo(note.id,"animate")}}>
                                        <p className="search-result-title"> {note.data.title} </p>
                                        <p className="search-result-text-preview"> {note.data.text.length > 128? note.data.text.slice(0,128)+"..." : note.data.text}</p>
                                    </div>
                                ))

                            }
                        </div>}
                    </div>
                }
            </div>}
        </main>
    );
}

export default Board;