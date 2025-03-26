import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import Body from "./routes/Routes";

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/*" element={<Body />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
