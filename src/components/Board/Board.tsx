import "./Board.css"
import { ReactFlow, Controls, Background } from "@xyflow/react"
import "@xyflow/react/dist/style.css";

function Board(){

    const nodes = [
    {
        id: "1",
        position: {
            x: 200,
            y: 200
        },
        data: {
            label: "Test Note"
        }
    },
    {
        id: "2",
        position: {
            x: 200,
            y: 600
        },
        data: {
            label: "Test Note 2"
        }
    }];

    return(
        <main className="board-container">
            <ReactFlow nodes={nodes} fitView>
                <Background/>
                <Controls />
            </ReactFlow>
        </main>
    );
}

export default Board;