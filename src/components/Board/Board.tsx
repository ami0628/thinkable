import "./Board.css"
import { ReactFlow, Controls, Background, applyNodeChanges, useReactFlow } from "@xyflow/react"
import type {Node} from "@xyflow/react"
import "@xyflow/react/dist/style.css";
import Note from "../Note/Note";
import ExpandedNote from "../Note/ExpandedNote"
import { useState } from "react"

const nodeTypes = {
    note: Note,
    expandedNote: ExpandedNote
};

type NoteData = {
    title: string,
    content: string,
    onExpand: (data:any) => void
}

type ExpandedNoteData = {
    title: string,
    content: string,
    originalId: string,
    onExit: (id:string, originalId:string, data:any, context:string) => void
}

type BoardNode = Node<NoteData | ExpandedNoteData>

let lastClick = 0;

function Board(){
    const [nodes, setNodes] = useState<BoardNode[]>([]);


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

    function removeNode(id:string){
        console.log("close")
        setNodes(currentNodes => currentNodes.filter(node => node.id !== id))
    }

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
            id: crypto.randomUUID(),
            type:"expandedNote",
            position:{
                x:400,
                y:400
            },
            data:{
                title: noteData.title,
                content: noteData.content,
                originalId: noteProps.id,
                onExit
            },
        }
        setNodes(currentItems =>[...currentItems, newExpandedNote])
    }

    function onExit(id:string, originalId:string, data:any, context:string){
        if (context == "save"){updateNodeData(originalId, data);};
        removeNode(id);
    }


    return(
        <main className="board-container">
            <ReactFlow nodes={nodes} fitView nodeTypes={nodeTypes} nodesDraggable={true} minZoom={0.1} maxZoom={8} zoomOnDoubleClick={false}
            onNodesChange={handleNodeChanges} onPaneClick={handleClick}>
                <Background/>
                <Controls />
            </ReactFlow>
        </main>
    );
}

export default Board;