"use client";
import { Coordinates } from "@/app/types/Coordinates";
import React, { useEffect, useRef, useState } from "react";

export interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  // onSelect: (location: Location) => void;
  onSelect: (coordinates: Coordinates) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]); // keep response from Leaflet
  const [noResults, setNoResults] = useState(false); // track no results
  const [enableSuggestion, setEnableSuggestion] = useState(false); // used to toggle the suggestion list
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLUListElement>(null);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setResults(
          data.map((place: any) => ({
            name: place.display_name,
            lat: place.lat,
            lon: place.lon,
          }))
        );
      }
      setEnableSuggestion(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setNoResults(true);
      setResults([]);
      setEnableSuggestion(true);
    }
  };

  const handleLocationSelection = (loc: Location) => {
    onSelect({ lat: loc.lat, lng: loc.lon });
    setEnableSuggestion(false);
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setEnableSuggestion(true);
    }
  };

  useEffect(() => {
    // the suggestion list should be disappear when the mouse is click outside of the search field
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setEnableSuggestion(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Search field */}
      <div className="flex gap-2">
        <input
          type="text"
          ref={inputRef}
          placeholder="Search for a location"
          value={query}
          //   onChange={handleInputChange}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-1 outline-gray-200 p-2 rounded w-full"
          onClick={handleFocus}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 rounded text-white px-4 py-2"
        >
          Search
        </button>
      </div>

      {/* Locations suggestion */}
      <div className="absolute left-0 mt-2 w-full bg-white z-9999">
        {enableSuggestion && results.length > 0 && (
          <ul className="border border-gray-200 rounded-md shadow-lg bg-gray-100" ref={suggestionRef}>
            {noResults ? (
              <li className="p-2 text-gray-500">No results found</li>
            ) : (
              results.map(
                (loc: Location, index: React.Key | null | undefined) => (
                  <li
                    key={index}
                    className="flex p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleLocationSelection(loc)}
                  >
                    {loc.name}
                    {/* <span className="text-gray-300">[{loc.lon}, {loc.lat}]</span> */}
                  </li>
                )
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
export default SearchBar;
