import { Routes, Route } from "react-router";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/Homepage";

function Body() {
    return (
      <div className="body-container">
        <Routes>
          <Route path="" element={<LoginPage />} />
          <Route path="/search" element={<HomePage />} />
        </Routes>
      </div>
    );
  }
  
  export default Body;
  