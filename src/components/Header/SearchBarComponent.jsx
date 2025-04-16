import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useRef } from "react";

export function SearchBarComponent({ gardens = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter gardens based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      if (searchResults.length !== 0) setSearchResults([]);
      return;
    }
    const filteredResults = gardens.filter((garden) => {
      if (!garden || !garden.name_area) return false;

      const nameMatch = garden.name_area
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const idMatch =
        garden.id_esp &&
        garden.id_esp.toLowerCase().includes(searchTerm.toLowerCase());

      return nameMatch || idMatch;
    });

    // Avoid setting state if results haven't changed
    const sameLength = searchResults.length === filteredResults.length;
    const sameItems = searchResults.every(
      (item, idx) => item._id === filteredResults[idx]?._id
    );

    if (!sameLength || !sameItems) {
      setSearchResults(filteredResults);
    }
  }, [searchTerm, gardens]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  const handleGardenClick = (gardenId) => {
    setIsSearching(false);
    setSearchTerm("");
    navigate(`/garden/${gardenId}`);
  };

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setIsSearching(true)}
        className="w-[400px] px-4 py-2 pl-10 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
        placeholder="Tìm kiếm khu vườn..."
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={18} />
      </div>

      {/* Search Results Dropdown */}
      {isSearching && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            searchResults.map((garden) => (
              <div
                key={garden._id}
                onClick={() => handleGardenClick(garden.id_esp)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center gap-3"
              >
                <img
                  src={
                    garden.img_area ||
                    require("../../assets/images/TreePlanting.png")
                  }
                  alt={garden.name_area}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {garden.name_area}
                  </p>
                </div>
              </div>
            ))
          ) : searchTerm.trim() ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Không tìm thấy khu vườn nào
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
