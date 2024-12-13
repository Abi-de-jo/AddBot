import PropTypes from "prop-types";
import useProperties from "../hooks/useProperties";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import user icon

const Profile = () => {
  const email = localStorage.getItem("email") || null; // Retrieve email from localStorage

  const { data, isLoading, error } = useProperties();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate("/");  
    window.location.reload()
  };

  if (!email) {
    // If no email in localStorage, show login message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4 ">
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

  // Filter properties by the current user's email and sort by latest updated time
  const filteredProperties =
    data
      ?.filter((property) => property.userEmail === email)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) || [];

  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`, { state: { card } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 mb-5">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center relative">
        <div className="relative flex justify-center items-center">
          <FaUserCircle className="text-blue-500 w-24 h-24" />
        </div>
        <p className="mt-4 text-xl font-bold text-gray-700">{email}</p>
        <p className="text-sm text-gray-500">Welcome back! Here is your dashboard.</p>
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Published Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200">
          Published Properties
        </h2>
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading properties...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching properties.</p>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredProperties.map((property) => (
              <div
                onClick={() => handleCardClick(property)}
                key={property.id}
                className="flex p-4 bg-gray-50 border border-gray-200 rounded-md shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
              >
                {/* Left: Image */}
                <div className="w-1/3 flex items-center justify-center">
                  <img
                    src={
                      property.images?.[0] ||
                      "https://via.placeholder.com/100x100?text=No+Image"
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
                    <span className="font-medium">Published:</span> {new Date(property.updatedAt).toLocaleDateString("en-GB")} {/* Format: DD/MM/YY */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No properties published yet.</p>
        )}
      </div>
    </div>
  );
};

Profile.propTypes = {
  email: PropTypes.string,
};

export default Profile;
