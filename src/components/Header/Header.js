import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../features/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = () => {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  return (
    <header className={`header ${theme}`}>
      <h1>Weather App</h1>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="theme-toggle-button"
      >
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </button>
    </header>
  );
};

export default Header;
