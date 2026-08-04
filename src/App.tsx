import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react"
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Board from "./pages/Board/BoardPage";

function App() {
  return(
    <ReactFlowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/board" element={<Board/>}></Route>
        </Routes>
      </BrowserRouter>
    </ReactFlowProvider>

  );
}

export default App;