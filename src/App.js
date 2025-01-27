import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Ourproduct from "./components/Ourproduct";
import Product1 from "./components/Product1";
import Idea from "./components/Idea";
import UnsortedIdea from "./components/UnsortedIdea";
import Purpose from "./components/Purpose";
import Links from "./components/Links";
import MyPage from "./components/MyPage";
import Login from "./components/Login";
import Note from "./components/Note";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./components/Signup";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/Purpose"
            element={<ProtectedRoute element={<Purpose />} />}
          />
          <Route
            path="/Links"
            element={<ProtectedRoute element={<Links />} />}
          />
          <Route
            path="/Ourproduct"
            element={<ProtectedRoute element={<Ourproduct />} />}
          />
          <Route path="/Idea" element={<ProtectedRoute element={<Idea />} />} />
          <Route
            path="/UnsortedIdea"
            element={<ProtectedRoute element={<UnsortedIdea />} />}
          />
          <Route
            path="/Product1"
            element={<ProtectedRoute element={<Product1 />} />}
          />
          <Route
            path="/MyPage"
            element={<ProtectedRoute element={<MyPage />} />}
          />
           <Route
            path="/Note"
            element={<ProtectedRoute element={<Note />} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
