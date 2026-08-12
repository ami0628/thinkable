import Header from "../../components/Header/Header";
import Sidebar from "../../components/BoardSidebar/BoardSidebar";
import Board from "../../components/Board/Board";
import { BoardProvider } from "../../context/BoardContext";
import { useParams, useSearchParams } from "react-router-dom";
import"./BoardPage.css";


function BoardPage (){
    const { boardId } = useParams();
    const [searchParams] = useSearchParams();
    if (!boardId) {return <div> Board not found </div>}
    const noteToPanTo = searchParams.get("note")

    return(
        <div>
            <Header/>
            <BoardProvider>
            <div className="board-layout">
                <Sidebar/>
                <Board boardId={boardId} noteToPanTo={noteToPanTo}/>
            </div>
            </BoardProvider>
        </div>
    );
}

export default BoardPage;