import  { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
 const SecondComponent = ({setStep}) => {
  const [secondFormData, setSecondFormData] = useState({
    ...JSON.parse(localStorage.getItem("form1")), // Spread data from form1 directly
    dealType: 'Rental',
    rooms: 1,
    size: 0,
    floor: "",
    totalFloors: 0,
    termDuration:'',
    address: JSON.parse(localStorage.getItem("form1"))?.address
    || "helo",
  
    city: 'Batumi',
    term: 'Long-term',
    price: null,
    currency: 'USD',
    commission:null,
    deposit: 0,
    paymentMethod: 'First and last month',
     metro: [],
    district: [],
    title: '',
    video: '',
    propertyType: '',
    residencyType: '',
     discount: 0,
      area: 0,
      type: '',
      parking: 0,
       bathrooms: 0,
      amenities: [],
      description: '',
      images: [],
      additional: [
     "balcony", 
        "noPetsRestriction",
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
      const res = await axios.post("https://add-bot-server.vercel.app/api/residency/create", {
        email,
        secondFormData,
      });
      console.log("Backend Response:", res);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      throw error;
    }


    const google_sheet_url =
    "https://script.google.com/macros/s/AKfycbx5n3QIcwrRlGxEhJgLC_uf4z82S7sI8vHgivKri6FHYG24aySoNXASWjNLQVaga7Zf/exec";

  // Create a FormData object with all the necessary details
  const formData = new FormData();
  Object.entries({
    ...secondFormData,
    images: secondFormData.images.join(", "), // Convert images array to a string
    metro: secondFormData.metro.join(", "), // Convert metro array to a string
    district: secondFormData.district.join(", "), // Convert district array to a string
    amenities: secondFormData.amenities.join(", "), // Convert amenities array to a string
    selectedAdditional: secondFormData.selectedAdditional?.join(", ") || "", // Convert selected additional features to a string
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
      const TELEGRAM_BOT_TOKEN = '7712916176:AAF15UqOplv1hTdJVxILWoUOEefEKjGJOso';
      const TELEGRAM_CHAT_ID = '1469627446';
  
      const uploadImagesToTelegram = async (images, chatId, botToken) => {
        const uploadedImages = [];
  
        for (const photo of images) {
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("photo", await fetch(photo).then((res) => res.blob()));
  
          const response = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendPhoto`,
            formData
          );
  
          if (images) {
            uploadedImages.push({
              type: "photo",
              media: response.data.result.photo[0].file_id,
            });
          }
        }
  
        // Send all uploaded images as a grid using sendMediaGroup
        if (uploadedImages.length > 0) {
          await axios.post(
            `https://api.telegram.org/bot${botToken}/sendMediaGroup`,
            {
              chat_id: chatId,
              media: uploadedImages,
            }
          );
        }
  
        console.log("Images sent as a grid to Telegram successfully!");
      };
  
      // Step 2: Upload grid images
      const images = secondFormData.images; // Array of image URLs or paths
      await uploadImagesToTelegram(images, TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN);
  
      // Step 3: Send the text message
      const message = `
      #${secondFormData?.city} #${secondFormData?.district} 🏢 #${secondFormData?.metro} 📍 ${secondFormData.address}
      
      🏢 #${secondFormData?.title} Apartment for #${secondFormData?.type}
      ✨ #${secondFormData?.residencyType}
      
      🏠 ${secondFormData.area} Sq.m | #${secondFormData?.floor}floor | #${secondFormData?.bathrooms}Bathroom
      
  ${secondFormData?.parking >= 1 ? "✅ Parking" : ""} 
 ${secondFormData.amenities
  .map((amenity) => `✅ #${amenity.replace(/\s+/g, "")}`) // Remove spaces in amenity names
  .join("\n")}

      
     ❌${secondFormData.parking === 0?"Parking" : ""}  ❌ Storage
      
      👥 For: Business
      🐕 Pets: ${secondFormData.selectedAdditional === "noPetsRestriction"? "Allowed":"Not Allowed"}
      ⏰ #LongTerm
      
      💰 ${secondFormData.price}${secondFormData.currency} | Deposit ${secondFormData.price}${secondFormData.currency}
      0% Commission
      #Price${secondFormData.price}
      
 
👤  Contact: [@David_Tibelashvili]
📞 +995 599 20 67 16 
      
      ⭐️ Check all listings | Reviews
      
      📸 [Instagram](https://www.instagram.com/rent_in_tbilisi?igsh=MWU5aWVxa3Fxd2dlbw==) 🌐 [FB](https://www.facebook.com/share/j6jBfExKXjgNVpVQ/) 🎥 [YouTube](https://www.youtube.com/@RENTINTBILISI)`;
      
      
  
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }
      );
  
      console.log("Message sent to Telegram successfully!");
  
      alert("Details published to Telegram successfully!");
      setStep(1); // Navigate back to FirstComponent
    } catch (error) {
      console.error("Failed to publish details to Telegram:", error);
      alert("Failed to publish details. Please try again.");
    }
  };
  
  
  

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  const newImages = files.map((file) => URL.createObjectURL(file)); // Create Blob URLs
  setSecondFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...newImages], // Add new images to state
  }));
};

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSecondFormData((prev) => ({
        ...prev,
        video: fileUrl, // Store the file URL in the state
      }));
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* Deal Type */}
        <div>
          <h3 className="text-lg font-semibold">Deal Type</h3>
          <div className="flex gap-4 mt-2">
            {['Rental', 'Sale'].map((type) => (
              <button
                key={type}
                onClick={() => setSecondFormData({ ...secondFormData, dealType: type })}
                className={`px-4 py-2 rounded-md ${
                  secondFormData.dealType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>


{/* title */}

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
              onChange={(e) => setSecondFormData({ ...secondFormData, rooms: Number(e.target.value) })}
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
              onChange={(e) => setSecondFormData({ ...secondFormData, area: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Size"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Floor</label>
            <input
  type="number"
  value={secondFormData.floor ?? ''} // Display an empty string if `floor` is null
  onChange={(e) => {
    const value = e.target.value === '' ? null : Number(e.target.value); // Convert to number or set to null
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
              onChange={(e) => setSecondFormData({ ...secondFormData, totalFloors: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Total Floors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Number of Parking</label>
            <select
              value={secondFormData.parking}
              defaultValue={secondFormData.parking}
              onChange={(e) => setSecondFormData({ ...secondFormData, parking: Number(e.target.value) })}
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
            <label className="block text-sm font-medium">Number of Bathroom</label>
            <select
              value={secondFormData.bathroooms}
              defaultValue={secondFormData.bathrooms}
              onChange={(e) => setSecondFormData({ ...secondFormData, bathrooms: Number(e.target.value) })}
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
  <label className="block text-sm font-medium mb-2">Metro Options</label>
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
      'Others',
    ].map((option, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={option}
          checked={
            option === 'Others'
              ? secondFormData.metro.includes('Others')
              : secondFormData.metro.includes(option)
          }
          onChange={(e) => {
            const isChecked = e.target.checked;

            if (option === 'Others') {
              // Handle "Others" checkbox
              if (!isChecked) {
                setSecondFormData({
                  ...secondFormData,
                  metro: secondFormData.metro.filter((m) => m !== 'Others'),
                  otherMetro: '', // Clear otherMetro value when unchecked
                });
              } else {
                setSecondFormData({
                  ...secondFormData,
                  metro: [...secondFormData.metro, 'Others'],
                });
              }
            } else {
              // Handle standard options
              const updatedMetro = isChecked
                ? [...secondFormData.metro, option]
                : secondFormData.metro.filter((m) => m !== option);

              setSecondFormData({ ...secondFormData, metro: updatedMetro });
            }
          }}
          className="w-4 h-4"
        />
        <label className="text-sm">{option}</label>
      </div>
    ))}
  </div>

  {/* Show text input if "Others" is selected */}
  {secondFormData.metro.includes('Others') && (
    <div className="mt-4">
      <label className="block text-sm font-medium">Specify Other Metro</label>
      <input
        type="text"
        value={secondFormData.otherMetro || ''}
        onChange={(e) =>
          setSecondFormData({ ...secondFormData, otherMetro: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Enter custom metro"
      />
    </div>
  )}
</div>


<div>
  <label className="block text-sm font-medium mb-2">district Options</label>
  <div className="flex flex-wrap gap-4">
    {[
      'District 1',
      'District 2',
      'District 3',
      'District 4',
      'District 5',
      'District 6',
      'District 7',
      'District 8',
      'District 9',
      'Others',
    ].map((option, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={option}
          checked={
            option === 'Others'
              ? secondFormData.district.includes('Others')
              : secondFormData.district.includes(option)
          }
          onChange={(e) => {
            const isChecked = e.target.checked;

            if (option === 'Others') {
              // Handle "Others" checkbox
              if (!isChecked) {
                setSecondFormData({
                  ...secondFormData,
                  district: secondFormData.district.filter((m) => m !== 'Others'),
                  otherdistrict: '', // Clear otherdistrict value when unchecked
                });
              } else {
                setSecondFormData({
                  ...secondFormData,
                  district: [...secondFormData.district, 'Others'],
                });
              }
            } else {
              // Handle standard options
              const updateddistrict = isChecked
                ? [...secondFormData.district, option]
                : secondFormData.district.filter((m) => m !== option);

              setSecondFormData({ ...secondFormData, district: updateddistrict });
            }
          }}
          className="w-4 h-4"
        />
        <label className="text-sm">{option}</label>
      </div>
    ))}
  </div>

  {/* Show text input if "Others" is selected */}
  {secondFormData.district.includes('Others') && (
    <div className="mt-4">
      <label className="block text-sm font-medium">Specify Other district</label>
      <input
        type="text"
        value={secondFormData.otherdistrict || ''}
        onChange={(e) =>
          setSecondFormData({ ...secondFormData, otherdistrict: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Enter custom metro"
      />
    </div>
  )}
</div>



        {/* images */}
        <div>
  <h3 className="text-lg font-semibold mb-2">images</h3>
  <p className="text-sm text-gray-500 mb-4">
    Upload additional images (max 10 images, max size per photo - 10MB, jpg or png).
  </p>
  <label
    htmlFor="photoUpload"
    className="flex flex-col items-center justify-center w-full max-w-sm p-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:border-blue-600 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-blue-500 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10l1.34-2.68A2 2 0 016 6h12a2 2 0 011.66.68L21 10M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M10 16h4"
      />
    </svg>
    <span className="text-sm text-gray-600">
      Click to upload or drag and drop images
    </span>
    <input
      id="photoUpload"
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>

  {/* Image Grid */}
  {secondFormData.images.length > 0 && (
  <div className="mt-4">
    <h4 className="text-sm font-medium mb-2">Uploaded Images:</h4>
    <div className="grid grid-cols-4 gap-4">
      {secondFormData.images.map((photo, index) => (
        <div
          key={index}
          className="relative group border border-gray-300 rounded-lg overflow-hidden"
        >
          <img
            src={photo}
            alt={`Uploaded ${index}`}
            className="w-full h-32 object-cover"
          />
          <button
            onClick={() =>
              setSecondFormData((prev) => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index),
              }))
            }
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}

</div>














<div>
  <h3 className="text-lg font-semibold mb-2">Video</h3>
  <p className="text-sm text-gray-500 mb-4">
    Upload a single video (max size - 10MB, formats: mp4 or mpeg).
  </p>
  <label
    htmlFor="VideoUpload"
    className="flex flex-col items-center justify-center w-full max-w-sm p-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:border-blue-600 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-blue-500 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10l1.34-2.68A2 2 0 016 6h12a2 2 0 011.66.68L21 10M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M10 16h4"
      />
    </svg>
    <span className="text-sm text-gray-600">
      Click to upload or drag and drop a video
    </span>
    <input
      id="VideoUpload"
      type="file"
      accept="video/mp4,video/mpeg"
      onChange={handleVideoUpload}
      className="hidden"
    />
  </label>

  {/* Video Preview */}
  {secondFormData.video && (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Uploaded Video:</h4>
      <div className="relative group border border-gray-300 rounded-lg overflow-hidden">
        <video
          src={secondFormData.video}
          controls
          className="w-full h-32 object-cover"
        />
        <button
          onClick={() =>
            setSecondFormData((prev) => ({
              ...prev,
              video: null, // Clear the video when removed
            }))
          }
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    </div>
  )}
</div>



        {/* Address */}
        <div>
               

        <select
  value={secondFormData.city} // Bind to the 'address' field in state
  onChange={(e) => setSecondFormData({ ...secondFormData, city: e.target.value })} // Update 'address' when selection changes
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
  onChange={(e) => setSecondFormData({ ...secondFormData, propertyType: e.target.value })} // Update 'address' when selection changes
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
  onChange={(e) => setSecondFormData({ ...secondFormData, residencyType: e.target.value })} // Update 'address' when selection changes
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
  onChange={(e) => setSecondFormData({ ...secondFormData, type: e.target.value })} // Update 'address' when selection changes
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
    {['Long-term', 'Daily'].map((term) => (
      <button
        key={term}
        onClick={() => setSecondFormData({ ...secondFormData, term })}
        className={`px-4 py-2 rounded-md ${
          secondFormData.term === term
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {term}
      </button>
    ))}
  </div>

  {/* Conditional UI based on selected term */}
  {secondFormData.term === 'Long-term' ? (
    <div className="space-y-4 mt-4">
      {/* Long-term specific fields */}
      <div className="flex gap-4">
        <button
          className={`flex-1 px-4 py-2 rounded-md ${
            secondFormData.termDuration === '1 month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() =>
            setSecondFormData({ ...secondFormData, termDuration: '1 month' })
          }
        >
          1 month
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-md ${
            secondFormData.termDuration === '6 months'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() =>
            setSecondFormData({ ...secondFormData, termDuration: '6 months' })
          }
        >
          6 months
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-md ${
            secondFormData.termDuration === '12 months'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() =>
            setSecondFormData({ ...secondFormData, termDuration: '12 months' })
          }
        >
          12 months
        </button>
      </div>

      {/* Commission */}
      <div>
        <label className="block text-sm font-medium">Commission</label>
        <select
          value={secondFormData.commission}
          onChange={(e) =>
            setSecondFormData({ ...secondFormData, commission: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Deposit */}
      <div>
        <label className="block text-sm font-medium">Deposit</label>
        <input
          type="number"
          value={secondFormData.deposit}
          onChange={(e) =>
            setSecondFormData({ ...secondFormData, deposit: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium">Payment Method</label>
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
          <option value="First and last month">First and last month</option>
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
            setSecondFormData({ ...secondFormData, price: Number(e.target.value) })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <select
          value={secondFormData.currency}
          onChange={(e) =>
            setSecondFormData({ ...secondFormData, currency: e.target.value })
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
            setSecondFormData({ ...secondFormData, discount: Number(e.target.value) })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <select
          value={secondFormData.currency}
          onChange={(e) =>
            setSecondFormData({ ...secondFormData, currency: e.target.value })
          }
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="USD">USD</option>
          <option value="GEL">GEL</option>
        </select>
      </div>
    </div>

        {/* amenities */}
        <div className=''>
          <h3 className="text-lg font-semibold">Amenities</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {['Central', 'Air conditioner', 'Electric', 'Underfloor amenities', 'Karma'].map(
              (option) => (
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {option}
                </button>
              )
            )}
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
            {item.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={secondFormData.selectedAdditional?.includes(item) || false}
            onChange={() => {
              setSecondFormData((prev) => {
                const isSelected = prev.selectedAdditional?.includes(item);
                const updatedSelected = isSelected
                  ? prev.selectedAdditional.filter((feature) => feature !== item)
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
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
