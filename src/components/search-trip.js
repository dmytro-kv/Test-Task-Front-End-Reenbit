import React, { useState } from "react";
import { users } from "../database/users";

const SearchTrip = () => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
    const filteredSuggestions = users.reduce((acc, user) => {
      const userTrips = user.trips.map((trip) => trip.city);
      const matchingCities = userTrips.filter((city) =>
        city.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      return [...acc, ...matchingCities];
    }, []);
    setSuggestions(filteredSuggestions);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]);
    const selectedTrip = users.find((user) =>
      user.trips.some(
        (trip) => trip.city.toLowerCase() === suggestion.toLowerCase()
      )
    );
    if (selectedTrip) {
      const selectedCityTrip = selectedTrip.trips.find(
        (trip) => trip.city.toLowerCase() === suggestion.toLowerCase()
      );
      if (selectedCityTrip) {
        const tripId = selectedCityTrip.tripId;
        const tripElement = document.getElementById(`trip-${tripId}`);
        if (tripElement) {
          tripElement.click();
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  return (
    <div className="search-trip">
      <div className="search-trip__field-wrap">
        <img
          className="search-trip__icon"
          alt="search-icon"
          src="./images/other-icons/search-icon.png"
        ></img>
        <input
          className="search-trip__field"
          type="text"
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Пошук міста..."
        />
      </div>
      {suggestions.length > 0 && ( // Додано умову для відображення випадаючого меню
        <ul className="search-trip__help-menu">
          {suggestions.map((suggestion, index) => (
            <li
              className="search-trip__help-item"
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchTrip;
