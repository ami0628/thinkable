import "./Board.css"
import { ReactFlow, Controls, Background, applyNodeChanges, useReactFlow } from "@xyflow/react"
import type {Node} from "@xyflow/react"
import "@xyflow/react/dist/style.css";
import Note from "../Note/Note";
import ExpandedNote from "../Note/ExpandedNote"
import { useState } from "react"

const nodeTypes = {
    note: Note,
};

type NoteData = {
    title: string,
    content: string,
    onExpand: (data:any) => void
}

type ExpandedWindow = {
    noteId: string,
    title:string,
    content:string,
    position:{
        x:number,
        y:number
    }
}

type BoardNode = Node<NoteData>

let lastClick = 0;

function Board(){
    const [nodes, setNodes] = useState<BoardNode[]>([]);
    const [expandedNotes, setExpandedNotes] = useState<ExpandedWindow[]>([]);


    function updateNodeData(id: string, newData:any){
        newData = {
            title:newData.title,
            content:newData.content,
            onExpand
        }
        console.log("save")
        setNodes(
            // go through all nodes
            // map(x => y) means "replace each x with y", here y is an expression
            currentNodes => currentNodes.map(node => 
                // if node matches id
                node.id === id ? {
                    // replaces node's data with new data
                    ...node, data:newData
                } :
                //otherwise, returns the original node
                node
            )
        );
    }

    function removeNode(id:string) {setNodes(currentNodes => currentNodes.filter(node => node.id !== id))}

    function handleNodeChanges(changes:any) {
        setNodes((nodes) => applyNodeChanges(changes, nodes))
    }

    // useReactFlow returns several helper functions, picking one to use
    const screenToFlowPosition = useReactFlow().screenToFlowPosition;

    function handleClick(data: { clientX: any; clientY: any; }){
        if (Date.now() - lastClick <= 250){ handleDoubleClick(data); }
        lastClick = Date.now();
        return
    }

    function handleDoubleClick(data: { clientX: any; clientY: any; }){
        // convert screen cursor positions into positions within the flow
        // screenToFlowPosition takes two coords and returns two coords - set position to result of func
        const position = screenToFlowPosition({
            x:data.clientX,
            y:data.clientY
        });

        // create new note and add to end of note list
        const newNote = {
            id:crypto.randomUUID(),
            type:"note",
            position:{
                x:position.x,
                y:position.y
            },
            data:{
                title:"",
                content:"",
                onExpand
            }
        }
        setNodes(currentItems =>[...currentItems, newNote])
    }

    function onExpand(noteProps:any){
        const noteData = noteProps.data;
        const newExpandedNote = {
            noteId: noteProps.id,
            title: noteData.title,
            content: noteData.content,
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
    }

    function getCenterOfView(){
        const center = {
            x: (window.innerWidth / 2) - 250,
            y: 80
        }
        return center
    }

    function onExit(noteId:string, data:any, context:string){
        if (context == "save"){updateNodeData(noteId, data);};
        // list of EN becomes the result of: [allow all notes where noteId is not the one being deleted]
        setExpandedNotes( current => current.filter(note => note.noteId !== noteId))
    }

    function updateExpandedNotePosition(noteId:string, position:{x:number, y:number}){
        setExpandedNotes(current =>
            current.map(note =>
                // if note is the one being dragged, update position,    (spread used like this updates the position as key cannot exist twice)
                {if (note.noteId == noteId) {return {...note, position}}
                //otherwise, return unchanged
                else {return note;}}
            )
        );
    }



    return(
        <main className="board-container">
            <ReactFlow nodes={nodes} fitView nodeTypes={nodeTypes} nodesDraggable={true} minZoom={0.1} maxZoom={8} zoomOnDoubleClick={false}
            onNodesChange={handleNodeChanges} onPaneClick={handleClick}>
                <Background/>
                <Controls />
            </ReactFlow>
            {expandedNotes.map(note =>
                <ExpandedNote
                    key={note.noteId}
                    data={note}
                    onExit={onExit}
                    updatePosition={updateExpandedNotePosition}
                />
            )}
        </main>
    );
}

export default Board;