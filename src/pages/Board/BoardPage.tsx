import Header from "../../components/Header/Header";
import Sidebar from "../../components/BoardSidebar/BoardSidebar";
import Board from "../../components/Board/Board";
import { BoardProvider } from "../../context/BoardContext";
import"./BoardPage.css";


function BoardPage (){


    return(
        <div>
            <Header/>
            <BoardProvider>
            <div className="board-layout">
                <Sidebar/>
                <Board/>
            </div>
            </BoardProvider>
        </div>
    );
}

export default BoardPage;