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
    updateNodeData: (id:string, data:any) => void
}

type BoardNode = Node<NoteData | ExpandedNoteData>

let lastClick = 0;

function Board(){
    const [nodes, setNodes] = useState<BoardNode[]>([
        {
            id:crypto.randomUUID(),
            type:"note",
            position:{
                x:200,
                y:200
            },
            data:{
                title:"test1",
                content:"test1content",
                onExpand
            }
        },
        {
            id:crypto.randomUUID(),
            type:"note",
            position:{
                x:300,
                y:600
            },
            data:{
                title:"test2",
                content:"test2content",
                onExpand
            }
        }
        
    ]);


    function updateNodeData(id: string, newData:any){
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

    function onExpand(noteData:any){
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
                originalId: noteData.id,
                updateNodeData
            },
        }
        setNodes(currentItems =>[...currentItems, newExpandedNote])
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