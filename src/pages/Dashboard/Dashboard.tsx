import Header from "../../components/Header/Header"
import "./Dashboard.css"
import { Search, SquarePlus, Brain, Clock, Pin } from "lucide-react";

function Dashboard (){
    return(
        <div>
            <Header></Header>
            <div className="body-container">
                <div className="dashboard-container">
                    <div className="dashboard-search-heading">
                    <h3 className="dashboard-heading"> Good evening, Alexander </h3>
                    <div className="dashboard-search-container">
                        <Search/>
                        <input type="text" className="dashboard-search" placeholder="Search"></input>
                    </div>
                    </div>
                    <div className="board-choices-big">
                        <div className="dashboard-card big">
                            <p> New board </p>
                            <SquarePlus className="icon"/>
                            <p> Start thinking with a blank canvas. </p>
                        </div>
                        <div className="dashboard-card big">
                            <p> Continue thinking... </p>
                            <Brain className="icon"/>
                            <div>
                                <p className="dashboard-card-title"> Project Ideas </p>
                                <p className="last-opened"> Last opened: 43 minutes ago. </p>
                            </div>
                        </div>
                    </div>
                    <div className="your-boards-container">
                        <h4> Your boards:</h4>
                        <hr></hr>
                        <div className="board-choices">
                            <div className="dashboard-card small">
                                <p className="dashboard-card-title"> University </p>
                                <div>
                                <p className="dashboard-card-title"> 36 notes </p>
                                <p className="last-opened"> Last opened: 2d ago </p>
                                </div>                                
                            </div>
                            <div className="dashboard-card small">
                                <p className="dashboard-card-title"> Recipes </p>
                                <div>
                                <p className="dashboard-card-title"> 12 notes </p>
                                <p className="last-opened"> Last opened: 2w ago </p>   
                                </div>                               
                            </div>
                            <div className="dashboard-card small">
                                <p className="dashboard-card-title"> Project ideas </p>
                                <div>
                                <p className="dashboard-card-title"> 25 notes </p>
                                <p className="last-opened"> Last opened: 1h ago </p>
                                </div>
                            </div>
                            <div className="dashboard-card small more">
                                <p className="dashboard-card-title"> More boards </p>
                            </div>
                        </div>
                    </div>
                    <div className="pinned-recents-container">
                        <div className="pinned-container">
                            <h4>Pinned notes: <Pin/></h4>
                            <hr></hr>
                            <div className="pins">
                                <div className="dashboard-card dashboard-note pin">
                                    <p>Thai green curry</p>
                                </div>
                                <div className="dashboard-card dashboard-note pin">
                                    <p>Dark steel recipe</p>
                                </div>
                                <div className="dashboard-card dashboard-note pin">
                                    <p>Compilers lecture notes</p>
                                </div>
                                <div className="dashboard-card dashboard-note pin">
                                    <p>Next function added</p>
                                </div>
                            </div>
                        </div>
                        <div className="recents-container">
                            <h4>Recents: <Clock/></h4>
                            <hr></hr>
                            <div className="recents">
                                <div className="dashboard-card dashboard-note recent">
                                    <p>Things i forget</p>
                                    <p className="last-opened">Last accessed: 2d ago</p>
                                </div>
                                <div className="dashboard-card dashboard-note recent">
                                    <p>new code</p>
                                    <p className="last-opened">Last accessed: 1h ago</p>
                                </div>
                                <div className="dashboard-card dashboard-note recent">
                                    <p>OK films</p>
                                    <p className="last-opened">Last accessed: 3h ago</p>
                                </div>
                                <div className="dashboard-card dashboard-note recent">
                                    <p>im running out of examples</p>
                                    <p className="last-opened">Last accessed: 5m ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;