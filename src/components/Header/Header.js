import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={`header ${theme}`}>
      <h1>Weather App</h1>
      <button onClick={toggleTheme} className="theme-toggle-button">
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </button>
    </header>
  );
};

export default Header;
