import { useNavigate } from "react-router-dom";
import "./Header.css"
function Header(){
    const navigate = useNavigate()

    return(
        <header> <p onClick={() => navigate(`/`)}>  Thinkable  </p>  </header>
    );
}

export default Header;