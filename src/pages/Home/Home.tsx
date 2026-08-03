import { Link } from "react-router-dom"

function Home (){
    return(
        <div>
            <div id="header"> <h1> Thinkable </h1> </div>
            <Link id="yes" to="/dashboard">
                Open Dashboard
            </Link>  
        </div>
    );
}

export default Home;