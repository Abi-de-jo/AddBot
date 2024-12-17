import { useEffect, useState } from "react";
import { getAllDraft } from "../utils/api";
 import { useNavigate } from "react-router-dom";

function Draft() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getAllDraft();
        setDrafts(data);
        console.log(data)
      } catch (err) {
        setError("Failed to fetch drafts. Please try again later.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);
 

 
  if (loading) {
    return <p className="text-center mt-10">Loading drafts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  

  if (loading) {
    return <p className="text-center mt-10">Loading drafts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }


  const handleImageClick = (draft) => {
    navigate(`/draft-details/${draft.id}`, { state: { draft } });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Drafts</h1>
      {drafts.length > 0 ? (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center bg-white border border-gray-300 rounded-xl shadow-md p-4"
              onClick={() => handleImageClick(draft)} // Navigate on image click

           >
              <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={draft?.images?.[0] || "https://via.placeholder.com/100x100?text=No+Image"}
                  alt={draft.title || "Draft"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 pl-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {draft.title || "Untitled Draft"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Price:</span> ${draft.price || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Status:</span> {draft.status}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Updated At:</span>{" "}
                  {new Date(draft.updatedAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No drafts available.</p>
      )}
    </div>
  );
}

export default Draft;
