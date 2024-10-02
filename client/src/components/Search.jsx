import "../assets/css/search.css";
import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as FilterIcon } from "../assets/svgs/filter-32.svg";
import { ReactComponent as SearchIcon } from "../assets/svgs/search.svg";
import { ReactComponent as DateIcon } from "../assets/svgs/date.svg";
import { ReactComponent as SortIcon } from "../assets/svgs/sort.svg";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import api from "../api";

export default function Search({ search }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(0);
  const [dateOption, setDateOption] = useState(0);

  const [costRange, setCostRange] = useState([1, 100]);
  const [showFilters, setShowFilter] = useState();

  const onSearch = () => {
    search(searchTerm, sortOption, costRange[0], costRange[1], dateOption);
  };

  const [suggestions, setSuggestions] = useState([]);

  const searchBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target))
        setSuggestions([]);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    setSuggestions([]);
    setShowFilter();
    onSearch();
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleSearchClick();

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) await fetchSuggestions(value);
    else setSuggestions([]);
  };

  const fetchSuggestions = async (value) => {
    try {
      const res = await api.get("auctions/suggestions", {
        params: { searchTerm: value },
      });
      setSuggestions(res.data.auctionsNames);
    } catch {}
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearchClick();
    setSuggestions([]);
  };

  const handleCostChange = (e, i) => {
    const newValues = [...costRange];
    let val = Number(e.target.value);

    if (val > 100) val = 100;
    if (val < 1) val = 1;

    newValues[i] = val;
    setCostRange(newValues);
  };

  const handleSliderChange = (values) => {
    const clampedValues = values.map((val) =>
      val > 100 ? 100 : val < 1 ? 1 : val
    );
    setCostRange(clampedValues);
  };

  const sortOptions = [
    { value: "0", label: "No sorting" },
    { value: "1", label: "By price increase" },
    { value: "2", label: "By price decrease" },
    { value: "3", label: "By date increase" },
    { value: "4", label: "By date decrease" },
    { value: "5", label: "Lots amount increase" },
    { value: "6", label: "Lots amount decrease" },
    { value: "7", label: "Users amount increase" },
    { value: "8", label: "Users amount decrease" },
  ];
  const dateOptions = [
    { value: "0", label: "All dates" },
    { value: "1", label: "Already started" },
    { value: "2", label: "Next 7 days" },
    { value: "3", label: "Next 30 days" },
    { value: "4", label: "Next 60 days" },
  ];

  return (
    <div className="auction-search">
      <div id="search-wrapper">
        <div
          ref={searchBarRef}
          className={`search-bar ${
            suggestions.length > 0 ? "with-suggestions" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <div
            className="toggle-filters"
            onClick={() => setShowFilter((p) => !p)}
          >
            <FilterIcon className="filter-icon" />
          </div>
        </div>
        <SearchIcon id="search" onClick={handleSearchClick} />
      </div>
      <div className={`filters ${showFilters && "show-filters"}`}>
        <div className="sort">
          <SortIcon />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="cost-filters">
          <label>Cost</label>
          <div>
            <input
              type="number"
              onChange={(e) => handleCostChange(e, 0)}
              value={costRange[0]}
              min={1}
              max={100}
            />
            <div>-</div>
            <input
              type="number"
              onChange={(e) => handleCostChange(e, 1)}
              value={costRange[1]}
              min={1}
              max={100}
            />
          </div>
          <RangeSlider
            min={1}
            max={100}
            value={costRange}
            onInput={handleSliderChange}
          />
        </div>
        <div className="cost-filters">
          <div className="sort">
            <DateIcon />
            <select
              value={dateOption}
              onChange={(e) => setDateOption(e.target.value)}
            >
              {dateOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <input
          type="button"
          value="OK"
          onClick={handleSearchClick}
          className="btn"
        />
      </div>
    </div>
  );
}
