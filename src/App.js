import React, { useContext } from "react";
import {
  ThemeProvider,
  ThemeContext,
} from "./components/ThemeContext/ThemeContext";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import "./App.css"; // Import the CSS file

const AppContent = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`app ${theme}`}>
      <Header />
      <SearchBar />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
