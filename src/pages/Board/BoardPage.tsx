import Header from "../../components/Header/Header";
import Sidebar from "../../components/BoardSidebar/BoardSidebar";
import Board from "../../components/Board/Board";
import { BoardProvider } from "../../context/BoardContext";
import { useParams } from "react-router-dom";
import"./BoardPage.css";


function BoardPage (){
    const { boardId } = useParams();
    if (!boardId) {return <div> Board not found </div>}

    return(
        <div>
            <Header/>
            <BoardProvider>
            <div className="board-layout">
                <Sidebar/>
                <Board boardId={boardId}/>
            </div>
            </BoardProvider>
        </div>
    );
}

export default BoardPage;