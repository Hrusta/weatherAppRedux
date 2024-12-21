import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import store from "./store";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import "./App.css";

const AppContent = () => {
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`app ${theme}`}>
      <Header />
      <SearchBar />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
