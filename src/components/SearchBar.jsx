import { useState } from "react";
import PropTypes from "prop-types";

function SearchBar({ onSearchSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
      );
      const data = await res.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    onSearchSelect([parseFloat(place.lat), parseFloat(place.lon)]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a place..."
        value={query}
        onChange={handleSearch}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((place, index) => (
            <li key={index} onClick={() => handleSelect(place)}>
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  onSearchSelect: PropTypes.func.isRequired,
};

export default SearchBar;
