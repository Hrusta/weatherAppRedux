import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import "./SearchBar.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchWeather = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=d7c9dc9e2cd54683a3b140128240411&q=${searchQuery}`
          );
          const data = await response.json();
          setWeatherData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWeather();
    }
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=d7c9dc9e2cd54683a3b140128240411&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      setSearchQuery(suggestions[0].name);
      setSuggestions([]);
    } else {
      setSearchQuery(searchInputRef.current.value);
    }
  };

  return (
    <div className={`search-page ${theme}`}>
      <form onSubmit={handleFormSubmit} className="search-form">
        <input
          type="text"
          ref={searchInputRef}
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter city name"
          autoComplete="off"
          className="search-input"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weatherData && weatherData.current && (
        <div className="weather-info">
          <h3>Weather in {weatherData.location.name}</h3>
          <p>Temperature: {weatherData.current.temp_c}°C</p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img src={weatherData.current.condition.icon} alt="Weather icon" />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
