import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import UploadImage from "./UploadImage";
import UploadVideo from "../../UploadVideo";
const SecondComponent = ({ setStep }) => {
  const [secondFormData, setSecondFormData] = useState({
    ...JSON.parse(localStorage.getItem("form1")), // Spread data from form1 directly
    dealType: "Rental",
    rooms: 1,
    size: 0,
    floor: "",
    totalFloors: 0,
    termDuration: "",
    address: JSON.parse(localStorage.getItem("form1"))?.address || "",
    addressURL:"",
    city: "Batumi",
    term: "Long-term",
    price: null,
    currency: "USD",
    commission: null,
    deposit: 0,
    paymentMethod: "FirstDeposit",
    metro: [],
    district: [],
    title: "",
    video: "",
    propertyType: "",
    residencyType: "",
    discount: 0,
    area: 0,
    type: "",
    parking: 0,
    bathrooms: 0,
    amenities: [],
    heating: [],
    description: "",
    images: [],
    additional: [
      "balcony",
      "PetsRestriction",
      "dishwasher",
      "oven",
      "bathtub",
      "twoOrMoreBathroom",
    ],
  });
  const handlePublish = async () => {
    const email = localStorage.getItem("email");
  
    try {
      // Step 1: Send form data to your backend
      const res = await axios.post(
        "http://localhost:3000/api/residency/create",
        {
          email,
          secondFormData,
        }
      );
      console.log("Backend Response:", res);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      throw error;
    }
  
    const google_sheet_url =
      "https://script.google.com/macros/s/AKfycbx5n3QIcwrRlGxEhJgLC_uf4z82S7sI8vHgivKri6FHYG24aySoNXASWjNLQVaga7Zf/exec";
  
    const formData = new FormData();
    Object.entries({
      ...secondFormData,
      images: secondFormData.images.join(", "),
      metro: secondFormData.metro.join(", "),
      district: secondFormData.district.join(", "),
      amenities: secondFormData.amenities.join(", "),
      selectedAdditional: secondFormData.selectedAdditional?.join(", ") || "",
    }).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      const googleResponse = await fetch(google_sheet_url, {
        method: "POST",
        body: formData,
      });
  
      if (googleResponse.ok) {
        const responseData = await googleResponse.json();
        console.log("Data posted to Google Sheets successfully:", responseData);
        alert("Details posted successfully to Google Sheets!");
      } else {
        console.error(
          "Failed to post data to Google Sheets:",
          googleResponse.statusText
        );
        alert("Failed to post details to Google Sheets.");
      }
    } catch (error) {
      console.error("Error posting to Google Sheets:", error);
      alert("An error occurred while posting to Google Sheets.");
    }
  
    try {
      const TELEGRAM_BOT_TOKEN = "7712916176:AAF15UqOplv1hTdJVxILWoUOEefEKjGJOso";
      const TELEGRAM_CHAT_ID = "-4545005015";
  
      const uploadMediaToTelegram = async (media, chatId, botToken, message) => {
        try {
          const uploadedMedia = [];
          const messageIdsToDelete = [];
  
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
  
            const messageId = response.data?.result?.message_id;
            const fileId =
              item.type === "photo"
                ? response.data?.result?.photo?.pop()?.file_id
                : response.data?.result?.video?.file_id;
  
            if (fileId && messageId) {
              uploadedMedia.push({
                type: item.type, // Ensure the type is correct for Telegram
                media: fileId,
              });
              messageIdsToDelete.push(messageId);
            } else {
              throw new Error("Failed to retrieve file_id or message_id");
            }
          }
  
          // Step 2: Send all media as a grid with the first captioned
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
  
            console.log(
              "Media (images/videos) and message sent as a single chat to Telegram successfully!"
            );
          } else {
            throw new Error("No media to send");
          }
  
          // Step 3: Delete the individual media messages
          for (const messageId of messageIdsToDelete) {
            await axios.post(
              `https://api.telegram.org/bot${botToken}/deleteMessage`,
              {
                chat_id: chatId,
                message_id: messageId,
              }
            );
          }
  
          console.log("Individual media messages deleted successfully!");
        } catch (error) {
          console.error(
            "Error uploading or sending media and message to Telegram:",
            error.response?.data || error.message
          );
        }
      };
  
      // Prepare images and videos for Telegram
      const media = [
        ...secondFormData.images.map((url) => ({ type: "photo", url })),
        ...(secondFormData.videos || []).map((url) => ({ type: "video", url })), // Videos should have type "video"
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
        secondFormData.amenities
      );
  
      const message = `
  #${secondFormData?.city}  #${secondFormData?.district} 🏢#${secondFormData?.metro} 
📍 [${secondFormData.address}](${secondFormData.addressURL})
  
  #${secondFormData?.title} Apartment near 
  Apartment for #${secondFormData?.type}✨ #${secondFormData?.residencyType}
  
  🏠 ${secondFormData.area} Sq.m | #${secondFormData?.floor}floor | #${secondFormData?.bathrooms}Bath
  
  ${amenitiesFormatted}
  ${secondFormData?.parking >= 1 ? "✅ Parking" : ""} 
  ${secondFormData.parking === 0 ? "❌ Parking" : ""}
  
  🐕 Pets: ${
        secondFormData.additional === "PetsRestriction"
          ? "#Allowed"
          : "#NotAllowed"
      }
  ⏰ #${secondFormData?.termDuration === "1 month"
          ? "1month"
          : secondFormData?.termDuration === "6 months"
          ? "6month"
          : secondFormData?.termDuration === "12 months"
          ? "12month"
          : ""
      }
  💳 #${secondFormData?.paymentMethod}   
  💰 ${secondFormData.price}${secondFormData.currency == "USD" ? "$" : "₾"} | Deposit ${secondFormData.price}${secondFormData.currency == "USD" ? "$" : "₾"}
  0% Commission
  #Price${secondFormData.price}
  
  👤 Contact: [@David_Tibelashvili]
  📞 +995 599 20 67 16 
  
  ⭐ [Check all listings](https://t.me/rent_tbilisi_ge/9859) | [Reviews](https://t.me/reviews_rent_tbilisi)
  
  📸 [Instagram](https://www.instagram.com/rent_in_tbilisi?igsh=MWU5aWVxa3Fxd2dlbw==) 🌐 [FB](https://www.facebook.com/share/j6jBfExKXjgNVpVQ/) 🎥 [YouTube](https://www.youtube.com/@RENTINTBILISI)
  `;
  
      await uploadMediaToTelegram(media, TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN, message);
  
      alert("Details published to Telegram successfully!");
      setStep(1); // Navigate back to FirstComponent
    } catch (error) {
      console.error("Error publishing details:", error);
      alert("Failed to publish details. Please try again.");
    }
  };
  
   
    const handleImageUpdate = (imageURLs) => {
    // Update images in the secondFormData
    setSecondFormData((prev) => ({
      ...prev,
      images: imageURLs,
    }));
  };

  const handleVideoUpload = (uploadedVideos) => {
    setSecondFormData((prev) => ({
      ...prev,
      videos: uploadedVideos, // Store the uploaded video URLs in state
    }));
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 mb-5">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* Deal Type */}
        <div>
          <h3 className="text-lg font-semibold">Deal Type</h3>
          <div className="flex gap-4 mt-2">
            {["Rental", "Sale"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSecondFormData({ ...secondFormData, dealType: type })
                }
                className={`px-4 py-2 rounded-md ${
                  secondFormData.dealType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* title */}

        <div>
  <label className="block text-sm font-medium">Address</label>
  <input
    type="text"
    value={secondFormData.address}
    onChange={(e) =>
      setSecondFormData({ ...secondFormData, address: e.target.value })
    }
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Enter address"
  />
</div>
<div>
  <label className="block text-sm font-medium">Address URL</label>
  <input
    type="url"
    value={secondFormData.addressURL}
    onChange={(e) =>
      setSecondFormData({ ...secondFormData, addressURL: e.target.value })
    }
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Paste URL here"
  />
</div>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={secondFormData.title}
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Number of Rooms, Size, Floors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Number of Rooms</label>
            <select
              value={secondFormData.rooms}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  rooms: Number(e.target.value),
                })
              }
              className="w-full p-2 px-1 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select
              </option>
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
              <option value="4+">4+ Rooms</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Size (sq. m)</label>
            <input
              type="number"
              value={secondFormData.area}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  area: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Size"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Floor</label>
            <input
              type="number"
              value={secondFormData.floor ?? ""} // Display an empty string if floor is null
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value); // Convert to number or set to null
                setSecondFormData({ ...secondFormData, floor: value });
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Floor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Floors</label>
            <input
              type="number"
              value={secondFormData.totalFloors}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  totalFloors: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Total Floors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Number of Parking
            </label>
            <select
              value={secondFormData.parking}
              defaultValue={secondFormData.parking}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  parking: Number(e.target.value),
                })
              }
              className="w-full p-2 px-1 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select
              </option>
              <option value="0">No Parking</option>
              <option value="1">1 Parking</option>
              <option value="2">2 Parking</option>
              <option value="3">3 Parking</option>
              <option value="4+">4+ Parking</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Number of Bathroom
            </label>
            <select
              value={secondFormData.bathroooms}
              defaultValue={secondFormData.bathrooms}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  bathrooms: Number(e.target.value),
                })
              }
              className="w-full p-2 px-1 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select
              </option>
              <option value="0">No Bathroom</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathroom</option>
              <option value="3">3 Bathroom</option>
              <option value="4+">4+ Bathroom</option>
            </select>
          </div>
        </div>

        {/* metro */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Metro Options
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              "Liberty Square",
              "Rustaveli",
              "Marjanishvili",
              "Station Square",
              "Tsereteli",
              "Gotsiridze",
              "Nadzaladevi",
              "Didube",
              "Grmagele",
              "Guramishvili",
              "Sarajishvili",
              "Akhmeteli Theatre",
              "State University",
              "Vazha-Pshavela",
              "Delisi",
              "Technical University",
              "Medical University",
              "Avlabari",
              "Isani",
              "300 Aragveli",
              "Samgori",
              "Varketili",
              "Others",
            ].map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    option === "Others"
                      ? secondFormData.metro.includes("Others")
                      : secondFormData.metro.includes(option)
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;

                    if (option === "Others") {
                      // Handle "Others" checkbox
                      if (!isChecked) {
                        setSecondFormData({
                          ...secondFormData,
                          metro: secondFormData.metro.filter(
                            (m) => m !== "Others"
                          ),
                          otherMetro: "", // Clear otherMetro value when unchecked
                        });
                      } else {
                        setSecondFormData({
                          ...secondFormData,
                          metro: [...secondFormData.metro, "Others"],
                        });
                      }
                    } else {
                      // Handle standard options
                      const updatedMetro = isChecked
                        ? [...secondFormData.metro, option]
                        : secondFormData.metro.filter((m) => m !== option);

                      setSecondFormData({
                        ...secondFormData,
                        metro: updatedMetro,
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>

          {/* Show text input if "Others" is selected */}
          {secondFormData.metro.includes("Others") && (
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Specify Other Metro
              </label>
              <input
                type="text"
                value={secondFormData.otherMetro || ""}
                onChange={(e) =>
                  setSecondFormData({
                    ...secondFormData,
                    otherMetro: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter custom metro"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            district Options
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              "Varkateli",
              "Samgori",
              "Isani",
              "Avlabari",
              "Sololaki",
              "Chugureti",
              "Vera",
              "Mtatsminda",
              "Vake",
              "Saburtalo",
              "Nadzaladevi",
              "Sanzona",
              "Dighomi",
              " Didi dighomi",
              "Gldani",
              "Others",
            ].map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    option === "Others"
                      ? secondFormData.district.includes("Others")
                      : secondFormData.district.includes(option)
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;

                    if (option === "Others") {
                      // Handle "Others" checkbox
                      if (!isChecked) {
                        setSecondFormData({
                          ...secondFormData,
                          district: secondFormData.district.filter(
                            (m) => m !== "Others"
                          ),
                          otherdistrict: "", // Clear otherdistrict value when unchecked
                        });
                      } else {
                        setSecondFormData({
                          ...secondFormData,
                          district: [...secondFormData.district, "Others"],
                        });
                      }
                    } else {
                      // Handle standard options
                      const updateddistrict = isChecked
                        ? [...secondFormData.district, option]
                        : secondFormData.district.filter((m) => m !== option);

                      setSecondFormData({
                        ...secondFormData,
                        district: updateddistrict,
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>

          {/* Show text input if "Others" is selected */}
          {secondFormData.district.includes("Others") && (
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Specify Other district
              </label>
              <input
                type="text"
                value={secondFormData.otherdistrict || ""}
                onChange={(e) =>
                  setSecondFormData({
                    ...secondFormData,
                    otherdistrict: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter custom metro"
              />
            </div>
          )}
        </div>

        {/* images */}

        <div>
  <h3 className="text-lg font-semibold mb-2">Images</h3>
  <p className="text-sm text-gray-500 mb-4">
    Upload additional images (max 10 images, max size per photo - 10MB,
    jpg or png).
  </p>
  <UploadImage onImageUpdate={handleImageUpdate} />
</div>

<div>
  <h3 className="text-lg font-semibold mb-2">Videos</h3>
  <p className="text-sm text-gray-500 mb-4">
    Upload Video (max 1 video, max size - 10MB to 30MB, mp4, mov, avi).
  </p>
  <UploadVideo onVideoUpdate={handleVideoUpload} />
</div>





 





        {/* Address */}
        <div>
          <select
            value={secondFormData.city} // Bind to the 'address' field in state
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, city: e.target.value })
            } // Update 'address' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select City
            </option>
            <option value="Tblisi">Tblisi</option>
            <option value="Batumi">Batumi</option>
            <option value="Kutaisi">Kutaisi</option>
            <option value="Rustavi">Rustavi</option>
          </select>
        </div>
        <div>
          <select
            value={secondFormData.propertyType} // Bind to the 'address' field in state
            onChange={(e) =>
              setSecondFormData({
                ...secondFormData,
                propertyType: e.target.value,
              })
            } // Update 'address' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Property
            </option>
            <option value="Office">Office</option>
            <option value="Cottage">Cottage</option>
            <option value="Commercial">Commercial</option>
            <option value="Apartment">Apartment</option>
            <option value="Land">Land</option>
          </select>
        </div>
        <div>
          <select
            value={secondFormData.residencyType} // Bind to the 'address' field in state
            onChange={(e) =>
              setSecondFormData({
                ...secondFormData,
                residencyType: e.target.value,
              })
            } // Update 'address' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Residency
            </option>
            <option value="New">New</option>
            <option value="Old">Old</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div>
          <select
            value={secondFormData.type} // Bind to the 'address' field in state
            onChange={(e) =>
              setSecondFormData({ ...secondFormData, type: e.target.value })
            } // Update 'address' when selection changes
            className="w-full p-2 px-1 border ml-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Rent">Rent</option>
            <option value="Sale">Sale</option>
            <option value="Lease">Lease</option>
            <option value="DailyRent">DailyRent</option>
          </select>
        </div>
        {/* Term */}
        <div>
          <h3 className="text-lg font-semibold">Term</h3>
          <div className="flex gap-4 mt-2">
            {["Long-term", "Daily"].map((term) => (
              <button
                key={term}
                onClick={() => setSecondFormData({ ...secondFormData, term })}
                className={`px-4 py-2 rounded-md ${
                  secondFormData.term === term
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {term}
              </button>
            ))}
          </div>

          {/* Conditional UI based on selected term */}
          {secondFormData.term === "Long-term" ? (
            <div className="space-y-4 mt-4">
              {/* Long-term specific fields */}
              <div className="flex gap-4">
                <button
                  className={`flex-1 px-4 py-2 rounded-md ${
                    secondFormData.termDuration === "1 month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() =>
                    setSecondFormData({
                      ...secondFormData,
                      termDuration: "1 month",
                    })
                  }
                >
                  1 month
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded-md ${
                    secondFormData.termDuration === "6 months"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() =>
                    setSecondFormData({
                      ...secondFormData,
                      termDuration: "6 months",
                    })
                  }
                >
                  6 months
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded-md ${
                    secondFormData.termDuration === "12 months"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() =>
                    setSecondFormData({
                      ...secondFormData,
                      termDuration: "12 months",
                    })
                  }
                >
                  12 months
                </button>
              </div>

              {/* Commission */}
              <div>
                <label className="block text-sm font-medium">Commission</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={secondFormData.commission}
                    onChange={(e) =>
                      setSecondFormData({
                        ...secondFormData,
                        commission: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Price</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={secondFormData.price}
                    onChange={(e) =>
                      setSecondFormData({
                        ...secondFormData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={secondFormData.currency}
                    onChange={(e) =>
                      setSecondFormData({
                        ...secondFormData,
                        currency: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="GEL">GEL</option>
                  </select>
                </div>
              </div>

              {/* Deposit */}
              <div>
                <label className="block text-sm font-medium">Deposit</label>
                <input
                  type="number"
                  value={secondFormData.deposit}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      deposit: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Method
                </label>
                <select
                  value={secondFormData.paymentMethod}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="FirstDeposit">
                  FirstDeposit
                  </option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
          ) : (
            // Daily-specific UI
            <div className="mt-4">
              <label className="block text-sm font-medium">Price</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={secondFormData.price}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={secondFormData.currency}
                  onChange={(e) =>
                    setSecondFormData({
                      ...secondFormData,
                      currency: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="GEL">GEL</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Discount</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={secondFormData.discount}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  discount: Number(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <select
              value={secondFormData.currency}
              onChange={(e) =>
                setSecondFormData({
                  ...secondFormData,
                  currency: e.target.value,
                })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="GEL">GEL</option>
            </select>
          </div>
        </div>

        {/* amenities */}
        <div className="">
          <h3 className="text-lg font-semibold">Heating</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
          "Central",
              "Karma",
              "Electric",
              "Air conditioner",
            ].map((option) => (
              <button
                key={option}
                onClick={() =>
                  setSecondFormData((prev) => ({
                    ...prev,
                    heating: prev.heating.includes(option)
                      ? prev.heating.filter((h) => h !== option)
                      : [...prev.heating, option],
                  }))
                }
                className={`px-4 py-2 rounded-md ${
                  secondFormData.heating.includes(option)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="">
          <h3 className="text-lg font-semibold">Amenities</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
              "Oven",
              "Stove",
              "Heater",
              "Elevator",
              "Balcony",
              "Microwave",
              "SmartTV",
              "Dishwasher",
              "ParkingPlace",
              "Projector",
              "VacuumCleaner",
              "AirConditioner",
              "WiFi",
              "PlayStation",
            ].map((option) => (
              <button
                key={option}
                onClick={() =>
                  setSecondFormData((prev) => ({
                    ...prev,
                    amenities: prev.amenities.includes(option)
                      ? prev.amenities.filter((h) => h !== option)
                      : [...prev.amenities, option],
                  }))
                }
                className={`px-4 py-2 rounded-md ${
                  secondFormData.amenities.includes(option)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Features</h3>
          <div className="grid grid-cols-1 gap-4">
            {secondFormData.additional.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {item.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      secondFormData.selectedAdditional?.includes(item) || false
                    }
                    onChange={() => {
                      setSecondFormData((prev) => {
                        const isSelected =
                          prev.selectedAdditional?.includes(item);
                        const updatedSelected = isSelected
                          ? prev.selectedAdditional.filter(
                              (feature) => feature !== item
                            )
                          : [...(prev.selectedAdditional || []), item];
                        return {
                          ...prev,
                          selectedAdditional: updatedSelected,
                        };
                      });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600 peer-checked:before:translate-x-4 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:bg-white before:border before:rounded-full before:h-4 before:w-4 before:transition-all peer-checked:before:border-white"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Button */}
        <div className="text-center">
          <button
            onClick={handlePublish}
            className="px-6 py-2  -mt-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

SecondComponent.propTypes = {
  localFormData: PropTypes.object.isRequired,
  setStep: PropTypes.func.isRequired,
  handlePublishToFirstComponent: PropTypes.func.isRequired,
};

export default SecondComponent;
