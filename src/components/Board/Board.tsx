import "./Board.css"
import { ReactFlow, Controls, Background, applyNodeChanges } from "@xyflow/react"
import "@xyflow/react/dist/style.css";
import Note from "../Note/Note";
import { useState } from "react"

const nodeTypes = {
    note: Note
};

function Board(){

    const [nodes, setNodes] = useState([
        {
            id:"1",
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
            id:"2",
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

    function handleNodeChanges(changes) {
        setNodes((nodes) => applyNodeChanges(changes, nodes))
    }

    return(
        <main className="board-container">
            <ReactFlow nodes={nodes} fitView nodeTypes={nodeTypes} nodesDraggable={true} maxZoom={8} onNodesChange={handleNodeChanges}>
                <Background/>
                <Controls />
            </ReactFlow>
        </main>
    );
}

export default Board;