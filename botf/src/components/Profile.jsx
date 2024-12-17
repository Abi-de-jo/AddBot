import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import UseAll from "../hooks/useall";

const Profile = () => {
  const teleNumber = localStorage.getItem("teleNumber") || null; // Retrieve teleNumber from localStorage
  const navigate = useNavigate();
const role = localStorage.getItem("role")
  const { data, isLoading, error } = UseAll();
  const [filterStatus, setFilterStatus] = useState("published"); // Default status filter

  console.log(data)
  // Filter and log properties based on the selected status
  const handleStatusClick = (status) => {
    setFilterStatus(status);
    const filteredData = data
      ? data.filter(
          (property) =>
            property.userTeleNumber== teleNumber && property.status === status
        )
      : [];
    console.log(`Filtered Properties with status "${status}":`, filteredData);

    console.log(filteredData)
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Navigate to agentPub with property details
  const handleCardClick = (property) => {
    navigate(`../agentPub/${property.id}`, { state: { property } });
  };

  if (!teleNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <FaUserCircle className="text-blue-500 w-24 h-24 mx-auto" />
          <p className="mt-4 text-xl font-bold text-gray-700">Please log in</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const filteredProperties = data
    ? data.filter(
        (property) =>
          property.userTeleNumber === teleNumber &&
          property.status === filterStatus
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center relative">
        <div className="relative flex justify-center items-center">
          <FaUserCircle className="text-blue-500 w-24 h-24" />
        </div>
        <p className="mt-4 text-xl font-bold text-gray-700">{teleNumber}</p>
        <p className="text-sm text-gray-500">Welcome back! Here is your dashboard.</p>
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Buttons to Filter Properties */}


  
    
      {role === "agent" && (
  <div className="flex justify-center space-x-4 mb-4">
    <button
      onClick={() => handleStatusClick("published")}
      className={`px-4 py-2 rounded-md shadow ${
        filterStatus === "published"
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700"
      } hover:bg-blue-400 transition`}
    >
      Published
    </button>
    <button
      onClick={() => handleStatusClick("rented")}
      className={`px-4 py-2 rounded-md shadow ${
        filterStatus === "rented"
          ? "bg-green-500 text-white"
          : "bg-gray-200 text-gray-700"
      } hover:bg-green-400 transition`}
    >
      Rented
    </button>
    <button
      onClick={() => handleStatusClick("archieve")}
      className={`px-4 py-2 rounded-md shadow ${
        filterStatus === "archived"
          ? "bg-red-500 text-white"
          : "bg-gray-200 text-gray-700"
      } hover:bg-red-400 transition`}
    >
      Archived
    </button>
  </div>
)}


      {/* Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200">
          {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Properties
        </h2>

        {isLoading ? (
          <p className="text-gray-600 text-center">Loading properties...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching properties. Please try again.</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handleCardClick(property)}
                className="flex p-4 bg-gray-50 border border-gray-200 rounded-md shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
              >
                {/* Left: Image */}
                <div className="w-1/3 flex items-center justify-center">
                  <img
                    src={
                      property.images?.[0] ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt="Property"
                    className="w-24 h-24 object-cover rounded-md border border-gray-300"
                  />
                </div>

                {/* Right: Details */}
                <div className="w-2/3 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {property.title || "Untitled Property"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Price:</span> {property.price || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Type:</span> {property.type || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Published:</span>{" "}
                    {new Date(property.updatedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No {filterStatus} properties found.
          </p>
        )}
      </div>
    </div>
  );
};

Profile.propTypes = {
  teleNumber: PropTypes.string,
};

export default Profile;
