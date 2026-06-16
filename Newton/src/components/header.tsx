import { useState } from "react";
import logo from "../assets/Gemini_Generated_Image_9zc6he9zc6he9zc6.png";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="mainHeader">
      <a href="/">
        <img src={logo} className="imgLogo" alt="logo" />
      </a>

      {/* Hamburger Button - Notice the 3 empty spans for the bars */}
      <button className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu} aria-label="Toggle Navigation">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Navigation List Container */}
      <nav className={`navMenu ${isOpen ? "open" : ""}`}>
        <ul className="navList">
          <li><a href="/">მთავარი</a></li>
          <li><a href="/formulas">ფორმულები</a></li>
          <li><a href="/projects">პროექტები</a></li>
          <li><a href="/assigments">დავალებები</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;