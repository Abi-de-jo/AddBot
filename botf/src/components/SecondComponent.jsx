import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import UploadImage from "./UploadImage";
import UploadVideo from "../../UploadVideo";
 import Confetti from "react-confetti"; // Ensure you have this installed
 
const SecondComponent = () => {
 
    const [isConfettiActive, setIsConfettiActive] = useState(false); // State to toggle confetti
  const [message, setMessage] = useState(""); // State for the success message

  const [secondFormData, setSecondFormData] = useState({
    ...JSON.parse(localStorage.getItem("form1")), // Spread data from form1 directly
    dealType: "Rental",
    rooms: "",
    size: "",
    floor: "",
    totalFloors: "",
    termDuration: "",
    address: JSON.parse(localStorage.getItem("form1"))?.address || "",
    addressURL:"",
    city: "Batumi",
    term: "Long-term",
    price: null,
    currency: "USD",
    commission: null,
    deposit: "",
    paymentMethod: "FirstDeposit",
    metro: [],
    district: [],
    title: "",
    video: "",
    propertyType: "",
    residencyType: "",
    pussy:"",
    discount: "",
    area: "",
    type: "",
    parking: "",
    bathrooms: "",
    amenities: [],
    heating: [],
    description: "",
    images: [],
    additional: [
      "PetsRestriction",
      "dishwasher",
       "bathtub",
      "twoOrMoreBathroom",
    ],
  });

  const role = localStorage.getItem("role")
  const handlePublish = async () => {
    const teleNumber = localStorage.getItem("teleNumber");

    if (Array.isArray(secondFormData.video)) {
      secondFormData.video = secondFormData.video[0] || ""; // Take the first video URL or set as empty string
    }
    try {
      console.log(secondFormData.video,"3333333333333333333333333333333333333333")
       const res = await axios.post(
        "https://add-bot-server.vercel.app/api/residency/create",
        {
          teleNumber,
          secondFormData,
        }
      );
       
       setIsConfettiActive(true);
    setMessage("Successfully created! Waiting for Agent Response...");
    console.log("Backend Response:", res);

    // Scroll to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });

    // Automatically stop confetti after 5 seconds
    setTimeout(() => setIsConfettiActive(false), 5000);
      console.log("Backend Response:", res);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      throw error;
    }}
  
   
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
      video: uploadedVideos,  
    }));
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 mb-5">
       {isConfettiActive && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 mb-6">
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

{/* //now changed */}

{role !=="user"  &&
 <div>
  <h3 className="text-lg font-semibold mb-2">Videos</h3>
  <p className="text-sm text-gray-500 mb-4">
    Upload Video (max 1 video, max size - 10MB to 30MB, mp4, mov, avi).
  </p>
  <UploadVideo onVideoUpdate={handleVideoUpload} />
</div>

}





 





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
            <div className="space-y-5 mt-4">
              {/* Long-term specific fields */}
              <div className="flex gap-4">
                <button
                  className={`flex-1 px-5 rounded-md ${
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
              {role !=="user"
             ? (
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
           ) : (
           <div>
                <label className="block text-sm font-medium">Role</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pussy"
                      value="agent"
                      checked={secondFormData.pussy === "agent"}
                      onChange={(e) =>
                        setSecondFormData({
                          ...secondFormData,
                          pussy: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    Agent
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pussy"
                      value="owner"
                      checked={secondFormData.pussy === "owner"}
                      onChange={(e) =>
                        setSecondFormData({
                          ...secondFormData,
                          pussy: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    Owner
                  </label>
                </div>
           </div>
           )}




    
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
        
        
          <div className="grid grid-cols-1 gap-4">
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
    <div
      key={option}
      className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm bg-white"
    >
      <div className="text-gray-800 font-medium text-sm">
        {option.replace(/([A-Z])/g, " $1")} {/* Adds spaces for camelCase */}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={secondFormData.amenities.includes(option)}
          onChange={() =>
            setSecondFormData((prev) => ({
              ...prev,
              amenities: prev.amenities.includes(option)
                ? prev.amenities.filter((item) => item !== option)
                : [...prev.amenities, option],
            }))
          }
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600 peer-checked:before:translate-x-4 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:bg-white before:border before:rounded-full before:h-4 before:w-4 before:transition-all peer-checked:before:border-white"></div>
      </label>
    </div>
  ))}
</div>



        </div>

                  <div>       
          <div className="grid grid-cols-1 gap-4">
            {secondFormData.additional.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-800 font-medium text-sm">
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

        


        </div>

        {/* Publish Button */}
        <div className="text-center">
          <button
            onClick={handlePublish}
            className="px-6 py-2 mb-7 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Publish
          </button>

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
