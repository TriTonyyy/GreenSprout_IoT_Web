import React, { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router";
import { getUserInfoAPI } from "../../api/AuthApi";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";
import { useRef } from "react";

function SearchBarComponent({ gardens = [] }) {
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
      setSearchResults([]);
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

    setSearchResults(filteredResults);
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
                  <p className="text-xs text-gray-500">ID: {garden.id_esp}</p>
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

function HeaderComponent({ gardens }) {
  const headerFont = "Kodchasan";
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    getUserInfoAPI()
      .then((res) => {
        setUserName(res.data.name);
        setAvatar(res.data.avatar);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigate = useNavigate();
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="h-16 px-6">
        <div className="flex h-full items-center justify-between">
          {/* Left side - Logo and Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img
              src={require("../../assets/images/TreePlanting.png")}
              className="h-12 w-12 object-contain"
              alt="logo"
            />
            <h1 className="text-2xl font-semibold text-green-600">
              GreenSprout
            </h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center gap-8">
            <SearchBarComponent gardens={gardens} />

            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/account")}
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Tài khoản</p>
              </div>

              <div className="flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    className="h-9 w-9 rounded-full border border-gray-200"
                    alt="avatar"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User size={20} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
