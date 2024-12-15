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
  });
  const navigate = useNavigate(); // Hook for navigation
  const email = localStorage.getItem("email");
<<<<<<< HEAD
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
=======
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713

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
    const matchesSearchTerm =
      property.title?.toLowerCase().includes(searchValue) ||
      property.address?.toLowerCase().includes(searchValue) ||
      property.city?.toLowerCase().includes(searchValue) ||
      property.type?.toLowerCase().includes(searchValue);

    const matchesFilters =
      (!filters.price || property.price <= filters.price) &&
      (!filters.city || property.city === filters.city);

    return matchesSearchTerm && matchesFilters;
  });

  // Handle card click to navigate to the details page
  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
  };

<<<<<<< HEAD
  const clearFilters = () => {
    setFilters({
      price: "",
      city: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 p-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Properties</h2>
=======
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Properties</h2>
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
            placeholder="🔍 Search properties by title, address, city, or type..."
          />
        </div>
      </div>

      {/* Filters Section */}
<<<<<<< HEAD
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
=======
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="p-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter max price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="p-1 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter city"
            />
          </div>
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
        </div>
      </div>

      {/* Properties Section */}
<<<<<<< HEAD
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3 border-gray-200">
=======
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200">
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
          Properties
        </h2>
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading properties...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching properties.</p>
        ) : filteredProperties.length > 0 ? (
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
=======
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handleCardClick(property)} // Attach click handler
<<<<<<< HEAD
                className="flex flex-col bg-gradient-to-r from-blue-50 to-gray-100 border border-gray-200 rounded-lg shadow-lg cursor-pointer relative "
=======
                className="flex flex-col bg-gray-50 border border-gray-200 rounded-md shadow cursor-pointer relative"
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
              >
                {/* Image */}
                <img
                  src={
                    property.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt="Property"
<<<<<<< HEAD
                  className="w-full h-48 object-cover rounded-t-lg"
=======
                  className="w-full h-48 object-cover rounded-t-md"
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
                />

                {/* Details */}
                <div className="p-4">
<<<<<<< HEAD
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {property.title || "Untitled Property"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
=======
                  <h3 className="text-lg font-semibold text-gray-800">
                    {property.title || "Untitled Property"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
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

<<<<<<< HEAD
                {/* Favorite Icon */}
                <div
                  className="absolute top-4 right-4 cursor-pointer "
=======
                {/* Buttons */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
                    Write
                  </button>
                </div>

                {/* Favorite Icon */}
                <div
                  className="absolute bottom-6 right-6 cursor-pointer"
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
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
<<<<<<< HEAD

      {/* Filter Popup */}
      {isFilterPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-6">Filter Properties</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <select
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select Price Range</option>
                <option value="100">0 - 100</option>
                <option value="200">101 - 200</option>
                <option value="300">201 - 300</option>
                <option value="400">301 - 400</option>
                <option value="500">401 - 500</option>
                <option value="3000">500+</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select City</option>
                <option value="Tbilisi">Tbilisi</option>
                <option value="Batumi">Batumi</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full shadow-lg "
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg "
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
    </div>
  );
}

export default Search;
