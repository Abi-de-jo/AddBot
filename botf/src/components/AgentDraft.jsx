import { useEffect, useState } from "react";
import { getAllDraftAgent } from "../utils/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AgentDraftDetails() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getAllDraftAgent();
        console.log(data)
        setDrafts(data);
      } catch (err) {
        setError("Failed to fetch drafts. Please try again later.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const navigate = useNavigate();

console.log("bbbbbbbbbbbbbbbbb")
  const handleAccept = async (id) => {
    const selectedDraft = drafts.find((draft) => draft.id === id);
    console.log(selectedDraft,"?mmmmmmmmmmmmmm")
    console.log("bbbbbbbbbbbbbbbbb")

     

    
    try {
      console.log("Accepted Draft Details:", selectedDraft);
      // Ensure `video` is a single string
      if (Array.isArray(selectedDraft.video)) {
        selectedDraft.video = selectedDraft.video[0] || ""; // Take the first video URL or default to an empty string
      }

      // Update status in the backend
      await axios.post(`https://add-bot-server.vercel.app/api/residency/publish/${id}`);

      // Google Sheets Integration
      const googleSheetUrl =
        "https://script.google.com/macros/s/AKfycbx5n3QIcwrRlGxEhJgLC_uf4z82S7sI8vHgivKri6FHYG24aySoNXASWjNLQVaga7Zf/exec";

      const formData = new FormData();
      Object.entries({
        ...selectedDraft,
        images: selectedDraft.images?.join(", ") || "",
        metro: selectedDraft.metro?.join(", ") || "",
        district: selectedDraft.district?.join(", ") || "",
        amenities: selectedDraft.amenities?.join(", ") || "",
        selectedAdditional: selectedDraft.selectedAdditional?.join(", ") || "",
        status: "published",
      }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const googleResponse = await fetch(googleSheetUrl, {
        method: "POST",
        body: formData,
      });

      if (googleResponse.ok) {
        console.log("Data posted to Google Sheets successfully!");
        alert("Details posted successfully to Google Sheets!");
      } else {
        console.error("Failed to post to Google Sheets.");
        alert("Failed to post details to Google Sheets.");
      }

      // Telegram Integration
      const TELEGRAM_BOT_TOKEN = "7712916176:AAF15UqOplv1hTdJVxILWoUOEefEKjGJOso";
      const TELEGRAM_CHAT_ID = "-4545005015";

      const uploadMediaToTelegram = async (media, chatId, botToken, message) => {
        try {
          const uploadedMedia = [];
          const messageIdsToDelete = []; // Keep track of individual message IDs for deletion
      
          // Step 1: Upload images and videos individually
          for (const item of media) {
            const formData = new FormData();
            formData.append("chat_id", chatId);
            formData.append(
              item.type === "photo" ? "photo" : "video",
              await fetch(item.url).then((res) => res.blob())
            );
      
            const response = await axios.post(
              `https://api.telegram.org/bot${botToken}/send${
                item.type === "photo" ? "Photo" : "Video"
              }`,
              formData
            );
      
            const messageId = response.data?.result?.message_id; // Get message ID for deletion
            const fileId =
              item.type === "photo"
                ? response.data?.result?.photo?.pop()?.file_id
                : response.data?.result?.video?.file_id;
      
            if (fileId && messageId) {
              uploadedMedia.push({
                type: item.type,
                media: fileId,
              });
              messageIdsToDelete.push(messageId); // Track the message ID for deletion later
            }
          }
      
          // Step 2: Send all media as a group with the first captioned
          if (uploadedMedia.length > 0) {
            const mediaWithCaption = [
              {
                ...uploadedMedia[0],
                caption: message,
                parse_mode: "Markdown",
              },
              ...uploadedMedia.slice(1),
            ];
      
            await axios.post(
              `https://api.telegram.org/bot${botToken}/sendMediaGroup`,
              {
                chat_id: chatId,
                media: mediaWithCaption,
              }
            );
      
            console.log("Media and message sent to Telegram successfully!");
          }
      
          // Step 3: Delete the individual media messages
          for (const messageId of messageIdsToDelete) {
            await axios.post(
              `https://api.telegram.org/bot${botToken}/deleteMessage`,
              {
                chat_id: chatId,
                message_id: messageId, // Delete individual media messages
              }
            );
          }
      
          console.log("Individual media messages deleted successfully!");
        } catch (error) {
          console.error("Error uploading or sending media and message to Telegram:", error);
        }
      };
      

      const media = [
        ...(selectedDraft.images || []).map((url) => ({ type: "photo", url })),
        ...(selectedDraft.video ? [{ type: "video", url: selectedDraft.video }] : []),
      ];

      const formatAmenitiesInTwoColumns = (amenities) => {
        const chunkedAmenities = [];
        for (let i = 0; i < amenities.length; i += 2) {
          chunkedAmenities.push(amenities.slice(i, i + 2));
        }

        return chunkedAmenities
          .map((row) =>
            row.map((amenity) => `✅#${amenity.replace(/\s+/g, "")}`).join("  ")
          )
          .join("\n");
      };

      const amenitiesFormatted = formatAmenitiesInTwoColumns(
        selectedDraft.amenities || []
      );

      const message = `
      #${selectedDraft?.city} #${selectedDraft?.district} 🏢#${selectedDraft?.metro}
📍[${selectedDraft.address}](${selectedDraft.addressURL})
        
#${selectedDraft?.title} Apartment near 
Apartment for #${selectedDraft?.type}✨ #${selectedDraft?.residencyType}
        
🏠 ${selectedDraft.area} Sq.m | #${selectedDraft?.floor}floor | #${selectedDraft?.bathrooms}Bath
        
${amenitiesFormatted}
${selectedDraft?.parking >= 1 ? "✅ Parking" : ""} 
      
${selectedDraft.parking === 0 ? "❌ Parking" : ""}
        
🐕 Pets: ${
      selectedDraft.additional === "PetsRestriction"
                ? "#Allowed"
                : "#NotAllowed"
            }
⏰ #${selectedDraft?.termDuration === "1 month"
                ? "1month"
                : selectedDraft?.termDuration === "6 months"
                ? "6month"
                : selectedDraft?.termDuration === "12 months"
                ? "12month"
                : ""
            }
💳 #${selectedDraft?.paymentMethod}   
💰 ${selectedDraft.price}${selectedDraft.currency == "USD" ? "$" : "₾"} | Deposit ${selectedDraft.price}${selectedDraft.currency == "USD" ? "$" : "₾"}
  0% Commission
  ${selectedDraft.price >= 0 && selectedDraft.price <= 300
          ? "#Price0to300"
          : selectedDraft.price > 300 && selectedDraft.price <= 500
          ? "#Price300to500"
          : selectedDraft.price > 500 && selectedDraft.price <= 700
          ? "#Price500to700"
          : selectedDraft.price > 700 && selectedDraft.price <= 900
          ? "#Price700to900"
          : selectedDraft.price > 900 && selectedDraft.price <= 1200
          ? "#Price900to1200"
          : selectedDraft.price > 1200 && selectedDraft.price <= 1500
          ? "#Price1200to1500"
          : selectedDraft.price > 1500 && selectedDraft.price <= 2000
          ? "#Price1500to2000"
          : selectedDraft.price > 2000 && selectedDraft.price <= 2500
          ? "#Price2000to2500"
          : selectedDraft.price > 2500 && selectedDraft.price <= 3000
          ? "#Price2500to3000"
          : selectedDraft.price > 3000
          ? "PriceAbove3000"
          : ""}  
      
👤 Contact: [@David_Tibelashvili]
📞 +995 599 20 67 16 | #${selectedDraft?.userTeleNumber}
        
⭐ [Check all listings](https://t.me/rent_tbilisi_ge/9859) | [Reviews](https://t.me/reviews_rent_tbilisi)
        
📸 [Instagram](https://www.instagram.com/rent_in_tbilisi?igsh=MWU5aWVxa3Fxd2dlbw==) 🌐 [FB](https://www.facebook.com/share/j6jBfExKXjgNVpVQ/) 🎥 [YouTube](https://www.youtube.com/@RENTINTBILISI)
        `;
        




      await uploadMediaToTelegram(media, TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN, message);

      alert("Details published to Telegram successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error handling accept action:", error);
      alert("An error occurred. Please try again.");
    }
  };

 
  if (loading) {
    return <p className="text-center mt-10">Loading drafts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  const handleReject = (id) => {
    console.log(`Draft with ID ${id} rejected.`);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Drafts</h1>
      {drafts.length > 0 ? (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div

              key={draft.id}
              className="flex items-center bg-white border border-gray-300 rounded-xl shadow-md p-4"
            >
              <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                <img
                            onClick={() => handleImageClick(draft)} // Navigate with draft details

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
                <FaCheckCircle
                  className="text-green-500 text-2xl cursor-pointer hover:text-green-600 transition-transform transform hover:scale-110"
                  onClick={() => handleAccept(draft.id)}
                />
                <FaTimesCircle
                  className="text-red-500 text-2xl cursor-pointer hover:text-red-600 transition-transform transform hover:scale-110"
                  onClick={() => handleReject(draft.id)}
                />
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

export default AgentDraftDetails;
