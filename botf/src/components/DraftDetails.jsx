import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const DraftDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { draft } = location.state || {}; // Destructure draft data from state
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState({ ...draft });

  if (!draft) {
    return <p className="text-center mt-10">Draft details not available.</p>;
  }

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDraft({ ...editedDraft, [name]: value });
  };

  // Save Updated Draft
  const handleSave = async () => {
    try {
      await axios.put(`https://add-bot-server.vercel.app/api/residency/update/${editedDraft.id}`, editedDraft);
      alert("Draft updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to update draft.");
    }
  };

  // Reject Draft
  const handleReject = async () => {
    try {
      await axios.delete(`https://add-bot-server.vercel.app/api/residency/delete/${draft.id}`);
      alert("Draft rejected successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting draft:", error);
      alert("Failed to reject draft.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 mb-7">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Back Button */}
        <button
          className="bg-gray-300 px-4 py-1 rounded-lg"
          onClick={() => navigate(-1)}
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800">
          {isEditing ? "Edit Draft" : editedDraft.title || "Untitled Draft"}
        </h1>

        {/* Images Section */}
        {editedDraft.images && editedDraft.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {editedDraft.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-md border"
              />
            ))}
          </div>
        )}

        {/* Editable Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(editedDraft).map(([key, value]) => {
            // Exclude unwanted keys
            if (["images", "id", "video", "pussy","userTeleNumber", "updatedAt", "address", "addressURL"].includes(key)) {
              return null;
            }

            // Allow editing only for 'title', 'price', and 'discount'
            const isEditable = ["title", "price", "discount"].includes(key);

            return (
              <div key={key}>
                <label className="block text-gray-600 font-semibold capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {isEditing && isEditable ? (
                  <input
                    type={key === "price" || key === "discount" ? "number" : "text"} // Use number input for price/discount
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                ) : (
                  <p className="text-gray-700">{value || "N/A"}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              

             >
                Edit
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftDetails;
