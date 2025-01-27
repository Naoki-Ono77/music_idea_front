import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // メニューの表示/非表示を切り替える
  };

  return (
    <nav className="navbar">
      {/* ハンバーガーメニューアイコン */}
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`menu ${isMenuOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Purpose">Purpose</Link>
        </li>
        <li>
          <Link to="/Links">Links</Link>
        </li>
        <li>
          <Link to="/Ourproduct">Our product</Link>
        </li>
        <li>
          <Link to="/Idea">Idea</Link>
        </li>
        <li>
          <Link to="/UnsortedIdea">Unsorted Idea</Link>
        </li>
        <li>
          <Link to="/Note">Note</Link>
        </li>
        <li>
          <Link to="/MyPage">MyPage</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
