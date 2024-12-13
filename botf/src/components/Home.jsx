import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProperties from "../hooks/useProperties";
import Map from "./Map";
import { BiHeart } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { getAllLikes } from "../utils/api";
 
function Home() {
  const { data, isLoading, error } = useProperties(); // Fetch properties using the hook
  const [isMapView, setIsMapView] = useState(false); // Toggle between List and Map view
  const [favorites, setFavorites] = useState([]); // Track favorite properties
  const navigate = useNavigate(); // Navigation hook

  const email = localStorage.getItem("email"); // Get user email from localStorage

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

  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
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
        await axios.post(`http://localhost:3000/api/user/likes/${propertyId}`, {
          email,
        });
        setFavorites((prev) => [...prev, propertyId]); // Add to favorites
        console.log(`Property Liked: ${propertyId}`);
      }
    } catch (error) {
      console.error("Error toggling favorite status", error);
    }
  };

  if (isLoading) {
    return <p className="text-gray-600 text-center">Loading properties...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error fetching properties.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button
          onClick={() => setIsMapView(!isMapView)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          {isMapView ? "View List" : "View Map"}
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isMapView ? (
          // Map View
          <div>
            <Map />
          </div>
        ) : (
          // List View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {data.map((property) => (
              <div
                key={property.id}
                className="flex flex-col bg-gray-50 border border-gray-200 rounded-md shadow cursor-pointer relative"
                onClick={() => handleCardClick(property)}
              >
                {/* Image */}
                <img
                  src={
                    property.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt="Property"
                  className="w-full h-48 object-cover rounded-t-md"
                />

                {/* Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {property.title || "Untitled Property"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
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

                {/* Buttons */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering card click
                      alert("Write functionality coming soon!");
                    }}
                  >
                    Write
                  </button>
                </div>

                {/* Favorite Icon */}
                <div
                  className="absolute bottom-4 right-4 cursor-pointer"
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
        )}
      </div>
    </div>
  );
}

export default Home;
