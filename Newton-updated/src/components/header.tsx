import { useState } from "react";
import logo from "../assets/Gemini_Generated_Image_9zc6he9zc6he9zc6.png";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="mainHeader">
      <a href="/">
        <img src={logo} className="imgLogo" alt="logo" />
      </a>

      <button className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu} aria-label="Toggle Navigation">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={`navMenu ${isOpen ? "open" : ""}`}>
        <ul className="navList">
          <li><a href="/">მთავარი</a></li>
          <li><a href="/formulas">ფორმულები</a></li>
          <li><a href="/projects">პროექტები</a></li>
          <li><a href="/assignments">დავალებები</a></li>
          <li>
            {isAuthenticated ? (
              <button type="button" className="navAuthBtn" onClick={logout}>გასვლა</button>
            ) : (
              <a href="/login">შესვლა</a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;