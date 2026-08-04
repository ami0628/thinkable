import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Board from "../../components/Board/Board";

import"./BoardPage.css";

function BoardPage (){
    return(
        <div>
            <Header/>
            <div className="board-layout">
                <Sidebar/>
                <Board/>
            </div>
        </div>
    );
}

export default BoardPage;