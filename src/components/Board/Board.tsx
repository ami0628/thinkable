import "./Board.css"
import { ReactFlow, Controls, Background, applyNodeChanges, useReactFlow, type NodeChange } from "@xyflow/react"
import "@xyflow/react/dist/style.css";
import Note from "../Note/Note";
import { useState } from "react"

const nodeTypes = {
    note: Note
};

function Board(){
    const [nodes, setNodes] = useState([
        {
            id:crypto.randomUUID(),
            type:"note",
            position:{
                x:200,
                y:200
            },
            data:{
                title:"test1",
                content:"test1content"
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
                content:"test2content"
            }
        }
        
    ]);

    function handleNodeChanges(changes: NodeChange<{ id: `${string}-${string}-${string}-${string}-${string}`; type: string; position: { x: number; y: number; }; data: { title: string; content: string; }; }>[]) {
        setNodes((nodes) => applyNodeChanges(changes, nodes))
    }

    const screenToFlowPosition = useReactFlow().screenToFlowPosition;

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
                content:""
            }
        }
        console.log(newNote)
        setNodes(currentItems =>[...currentItems, newNote])
    }

    

    return(
        <main className="board-container">
            <ReactFlow nodes={nodes} fitView nodeTypes={nodeTypes} nodesDraggable={true} maxZoom={8} onNodesChange={handleNodeChanges} onPaneClick={handleDoubleClick}>
                <Background/>
                <Controls />
            </ReactFlow>
        </main>
    );
}

export default Board;