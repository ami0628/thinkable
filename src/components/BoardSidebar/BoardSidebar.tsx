import "./BoardSidebar.css"
import {ChevronDown, Settings, Brain, Search} from 'lucide-react';

function Sidebar(){
    return(
        <aside>
            <div className="sidebar-heading clickable"><Brain/> Boards </div>
            <div className="sidebar-heading clickable"><Search/> Search  </div>
            <div className="sidebar-heading clickable"><Settings/> Settings  </div>
            
            <br/>
            <div className="sidebar-heading clickable"> Pinned notes <ChevronDown /></div>
            <ul>
                <li>
                    example note 1
                </li>
                <li>
                    example note 2
                </li>
            </ul>
            <div className="sidebar-heading clickable"> Recent notes <ChevronDown /></div>
            <ul>
                <li>
                    example note 3
                </li>
                <li>
                    example note 4
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;