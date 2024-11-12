import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback,
  useReducer,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import "./SearchBar.css";

// Inicijalni state za vrijeme
const initialState = {
  weatherData: null,
  isLoading: false,
  error: null,
};

// Reducer funkcija
const weatherReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, weatherData: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const SearchBar = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const previousSearchQueryRef = useRef("");
  const { theme } = useContext(ThemeContext);
  const [{ weatherData, isLoading, error }, dispatch] = useReducer(
    weatherReducer,
    initialState
  );

  // Fokus na inputu
  useLayoutEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Izlozi metodu parent komponenti
  useImperativeHandle(ref, () => ({
    clearSearch: () => setSearchQuery(""),
  }));

  // Fetch vrijeme kada se promjeni input
  useEffect(() => {
    if (searchQuery) {
      const fetchWeather = async () => {
        dispatch({ type: "FETCH_START" });
        try {
          const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=d7c9dc9e2cd54683a3b140128240411&q=${searchQuery}` //napomena moram dodati .env za apiURL
          );
          const data = await response.json();
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (err) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      };
      fetchWeather();
    }
  }, [searchQuery]);

  // Fetcha prijedloge gradova na osnovu unesenog
  const fetchSuggestions = useCallback(async (query) => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=d7c9dc9e2cd54683a3b140128240411&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Handla input promjene i fetcha prijedloge
  const handleInputChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    },
    [fetchSuggestions]
  );

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  }, []);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSearchQuery(suggestions[0].name);
        setSuggestions([]);
      } else {
        setSearchQuery(searchInputRef.current.value);
      }
    },
    [suggestions]
  );

  useEffect(() => {
    previousSearchQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Pamti vremenske detalje da se ne bi bez potrebe rerenderovalo
  const memoizedWeatherDetails = useMemo(() => {
    if (!weatherData || !weatherData.location || !weatherData.current) {
      return null;
    }
    return {
      location: weatherData.location.name,
      temperature: weatherData.current.temp_c,
      condition: weatherData.current.condition.text,
      icon: weatherData.current.condition.icon,
    };
  }, [weatherData]);

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
      {memoizedWeatherDetails && (
        <div className="weather-info">
          <h3>Weather in {memoizedWeatherDetails.location}</h3>
          <p>Temperature: {memoizedWeatherDetails.temperature}°C</p>
          <p>Condition: {memoizedWeatherDetails.condition}</p>
          <img src={memoizedWeatherDetails.icon} alt="Weather icon" />
        </div>
      )}
    </div>
  );
});

export default SearchBar;
