import { useState, useEffect } from "react";
import useProperties from "../hooks/useProperties";
import { useNavigate } from "react-router-dom"; // Import the hook for navigation
import { BiHeart } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { getAllLikes } from "../utils/api";

function Search() {
  const [favorites, setFavorites] = useState([]); // Track favorite properties
  const { data, isLoading, error } = useProperties(); // Fetch all properties using the hook
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [filters, setFilters] = useState({
    price: "",
    city: "",
    category: "",
    amenities: [],
    rooms: "",
    heating: [], // Heating filter as an array
  });
  const navigate = useNavigate(); // Hook for navigation
  const email = localStorage.getItem("email");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (email) {
        try {
          const likedProperties = await getAllLikes(); // Fetch liked properties
          setFavorites(likedProperties); // Update favorites state
          console.log("Fetched liked properties:", likedProperties);
        } catch (error) {
          console.error("Error fetching liked properties", error);
        }
      }
    };
    fetchLikes();
  }, [email]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = async (propertyId) => {
    const isLiked = favorites.includes(propertyId);

    try {
      if (isLiked) {
        await axios.delete(
          `https://add-bot-server.vercel.app/api/user/dislikes/${propertyId}`,
          { data: { email } }
        );
        setFavorites((prev) => prev.filter((id) => id !== propertyId)); // Remove from favorites
        console.log(`Property Disliked: ${propertyId}`);
      } else {
        await axios.post(`https://add-bot-server.vercel.app/api/user/likes/${propertyId}`, {
          email,
        });
        setFavorites((prev) => [...prev, propertyId]); // Add to favorites
        console.log(`Property Liked: ${propertyId}`);
      }
    } catch (error) {
      console.error("Error toggling favorite status", error);
    }
  };

  // Filter properties based on the search term and filters
  const filteredProperties = data?.filter((property) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = property.title?.toLowerCase().includes(searchValue);
    const matchesCity = !filters.city || property.city === filters.city;
    const matchesPrice =
      !filters.price || property.price <= parseInt(filters.price, 10);
    const matchesCategory = !filters.category || property.type === filters.category;
    const matchesAmenities =
      !filters.amenities.length ||
      filters.amenities.every((amenity) => property.amenities?.includes(amenity));
    const matchesRooms = !filters.rooms || property.rooms === filters.rooms;
    const matchesHeating =
      !filters.heating.length ||
      filters.heating.every((heat) => property.heating?.includes(heat));
    return (
      matchesSearch &&
      matchesCity &&
      matchesPrice &&
      matchesCategory &&
      matchesAmenities &&
      matchesRooms &&
      matchesHeating
    );
  });
  

  // Handle card click to navigate to the details page
  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
  };

  const clearFilters = () => {
    setFilters({
      price: "",
      city: "",
      category: "",
      amenities: [],
      rooms: "",
      heating: [], // Heating filter as an array
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 p-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Properties</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="🔍 Search properties by title, address, city, or type..."
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Filters</h2>
          <button
            onClick={() => setIsFilterPopupOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full shadow-lg"
          >
            Open Filters
          </button>
        </div>
        {/* Display current filter values */}
        <div className="mt-4">
          <p className="text-gray-700 text-sm">Max Price: <span className="font-semibold">{filters.price || 'Not set'}</span></p>
          <p className="text-gray-700 text-sm">City: <span className="font-semibold">{filters.city || 'Not set'}</span></p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">
          Properties
        </h2>
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading properties...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching properties.</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handleCardClick(property)} // Attach click handler
                className="flex flex-col bg-gradient-to-r from-blue-50 to-gray-100 border border-gray-200 rounded-lg shadow-lg cursor-pointer relative "
              >
                {/* Image */}
                <img
                  src={
                    property.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt="Property"
                  className="w-full h-48 object-cover rounded-t-lg"
                />

                {/* Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {property.title || "Untitled Property"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Price:</span> {property.price || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Type:</span> {property.type || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">City:</span> {property.city || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Address:</span> {property.address || "N/A"}
                  </p>
                </div>

                {/* Favorite Icon */}
                <div
                  className="absolute top-4 right-4 cursor-pointer "
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card click
                    toggleFavorite(property.id);
                  }}
                >
                  {favorites.includes(property.id) ? (
                    <AiFillHeart color="red" size={30} className="animate-pulse" />
                  ) : (
                    <BiHeart color="gray" size={30} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No properties found matching your search.</p>
        )}
      </div>

      {/* Filter Popup */}

      {isFilterPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Filters</h2>

            {/* City */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select City</option>
                <option value="Tblisi">Tbilisi</option>
                <option value="Batumi">Batumi</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <select
                value={filters.price}
                onChange={(e) => handleFilterChange("price", e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select Range</option>
                <option value="350">Before 350 USD</option>
                <option value="500">350 – 500 USD</option>
                <option value="700">500 – 700 USD</option>
                <option value="1000">850 – 1000 USD</option>
                <option value="1000+">1000 USD +</option>
              </select>
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <div className="flex gap-2 mt-1">
                {["All", "Rent", "Sale"].map((option) => (
                  <label key={option} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="category"
                      value={option === "All" ? "" : option}
                      checked={filters.category === (option === "All" ? "" : option)}
                      onChange={() => handleFilterChange("category", option === "All" ? "" : option)}
                      className="mr-1"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Number of Rooms */}
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Number of Rooms</h3>
              <div className="grid grid-cols-3 gap-2">
                {["1", "2", "3", "4+"].map((option) => (
                  <label
                    key={option}
                    className={`cursor-pointer border rounded px-2 py-1 text-center text-xs ${
                      filters.rooms === option ? "bg-blue-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rooms"
                      value={option}
                      checked={filters.rooms === option}
                      onChange={() => handleFilterChange("rooms", option)}
                      className="hidden"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Heating */}
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Heating</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Bce", "Central", "Electric", "Air Conditioner", "Underfloor Heating", "Karma"].map(
                  (option) => (
                    <label key={option} className="flex items-center text-xs justify-between">
                      <span className="text-gray-700">{option.replace(/([A-Z])/g, " $1").trim()}</span>
                      <input
                        type="checkbox"
                        checked={filters.heating.includes(option)}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            heating: prev.heating.includes(option)
                              ? prev.heating.filter((item) => item !== option)
                              : [...prev.heating, option],
                          }))
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Oven",
                  "Stove",
                  "Heater",
                  "Elevator",
                  "Balcony",
                  "Microwave",
                  "SmartTV",
                  "ParkingPlace",
                  "Projector",
                  "VacuumCleaner",
                  "AirConditioner",
                  "WiFi",
                  "PlayStation",
                ].map((option) => (
                  <label key={option} className="flex items-center text-xs justify-between">
                    <span className="text-gray-700">{option.replace(/([A-Z])/g, " $1").trim()}</span>
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(option)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          amenities: prev.amenities.includes(option)
                            ? prev.amenities.filter((item) => item !== option)
                            : [...prev.amenities, option],
                        }))
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="sticky bottom-0 bg-white border-t pt-3 flex justify-between">
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="w-1/3 bg-gray-300 px-4 py-2 rounded-l-lg text-gray-700 hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={clearFilters}
                className="w-1/3 bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Clear
              </button>
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="w-1/3 bg-blue-500 px-4 py-2 rounded-r-lg text-white hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
    </div>
  </div>
)}





    </div>
  );
}

export default Search;
