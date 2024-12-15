import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";

const UploadImage = ({ onImageUpdate }) => {
  const [imageURLs, setImageURLs] = useState([]);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const deleteImage = (index) => {
    const updatedImages = imageURLs.filter((_, i) => i !== index);
    setImageURLs(updatedImages);
    onImageUpdate(updatedImages); // Notify parent component
  };

  useEffect(() => {
    const loadCloudinary = () => {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: "dbandd0k7",
            uploadPreset: "zf9wfsfi", // Separate preset for images
            resourceType: "image", // Only allow images
            multiple: true,
            maxFileSize: 10000000, // 10MB limit
            allowedFormats: ["jpg", "png" , "jpeg"], // Restrict to image formats
          },
          (err, result) => {
            if (result.event === "success") {
              const updatedImages = [...imageURLs, result.info.secure_url];
              setImageURLs(updatedImages);
              onImageUpdate(updatedImages); // Notify parent component
            }
          }
        );
      };
      document.body.appendChild(script);
    };

    loadCloudinary();
  }, [imageURLs, onImageUpdate]);

  return (
    <div className="flex flex-col items-center">
      {imageURLs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center w-full max-w-sm p-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:border-blue-600 transition"
          onClick={() => widgetRef.current?.open()}
        >
          <AiOutlineCloudUpload className="text-blue-500 mb-2" size={50} />
          <span className="text-sm text-gray-600">Click to upload images</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {imageURLs.map((url, index) => (
            <div
              key={index}
              className="relative border border-gray-300 rounded-lg overflow-hidden group"
            >
              <img
                src={url}
                alt={`Uploaded ${index}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => deleteImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={() => widgetRef.current?.open()}
      >
        Add More Images
      </button>
    </div>
  );
};

UploadImage.propTypes = {
  onImageUpdate: PropTypes.func.isRequired,
};

export default UploadImage;
