import { Link } from "react-router-dom"
import Header from "../../components/Header/Header"

function Home (){
    return(
        <div>
            <Header/>
            <Link id="yes" to="/dashboard">
                Open Dashboard
            </Link>  
        </div>
    );
}

export default Home;