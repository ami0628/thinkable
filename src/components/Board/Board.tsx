import "./Board.css"
import { ReactFlow, Controls, Background, applyNodeChanges, useReactFlow } from "@xyflow/react"
import type {Node} from "@xyflow/react"
import "@xyflow/react/dist/style.css";
import Note from "../Note/Note";
import ExpandedNote from "../Note/ExpandedNote"
import Popup from "../Popup/Popup";
import { useEffect, useState, useRef } from "react"
import { useBoard } from "../../context/BoardContext";

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

type BoardNode = Node<NoteData>

function Board(){
    const [nodes, setNodes] = useState<BoardNode[]>([]);
    const [expandedNotes, setExpandedNotes] = useState<ExpandedWindow[]>([]);

    const {
        pinnedNotes,
        recentNotes,
        addPinnedNote,
        removePinnedNote,
        updatePinnedNote,
        updateRecentNotes,
        removeRecentNote,
        boardAction,
        resetBoardAction
    } = useBoard()

    useEffect(() => {
        console.log(boardAction)
        if (boardAction !== null) {
            const noteToActOn = nodes.find(note => note.id == boardAction.noteId)
            if (!noteToActOn) {return}
            if (boardAction.type === "open"){
                onExpand(noteToActOn);
            }
            if (boardAction.type === "pan"){
                let centerPosX = noteToActOn.position.x;
                const width = noteToActOn.measured?.width ?? noteToActOn.data.width
                if (noteToActOn.data.width) {centerPosX += width/2}

                let centerPosY = noteToActOn.position.y;
                const height = noteToActOn.measured?.height ?? noteToActOn.data.height
                if (noteToActOn.data.height) {centerPosY += height/2}

                setCenter(centerPosX, centerPosY, {zoom:1.2, duration:1000});
            }
            resetBoardAction()
        }
    },[boardAction])

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
                if (pinnedNote.noteId == note.id && pinnedNote.title !== note.data.title) {updatePinnedNote({noteId:pinnedNote.noteId, title:note.data.title})}
            })
        })

        recentNotes.forEach(recentNote =>{
            nodes.map(note => {
                if (recentNote.noteId == note.id && recentNote.title !== note.data.title) {updateRecentNotes({noteId:recentNote.noteId, title:note.data.title})}
            })
        })

    },[nodes])

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
    const { screenToFlowPosition, setCenter } = useReactFlow();
    

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
        updateRecentNotes({noteId:noteProps.id, title:noteData.title})
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
        </main>
    );
}

export default Board;