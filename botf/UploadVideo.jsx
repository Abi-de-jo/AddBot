import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";

const UploadVideo = ({ onVideoUpdate }) => {
  const [videoURLs, setVideoURLs] = useState([]);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const deleteVideo = (index) => {
    const updatedVideos = videoURLs.filter((_, i) => i !== index);
    setVideoURLs(updatedVideos);
    onVideoUpdate(updatedVideos); // Notify parent component
  };

  useEffect(() => {
    const loadCloudinary = () => {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: "dbandd0k7", // Replace with your Cloudinary cloud name
            uploadPreset: "zf9wfsfi", // Replace with your Cloudinary upload preset
            resourceType: "video", // Specify "video" for video uploads
            multiple: false, // Only allow one video
            maxFileSize: 30000000, // 30MB limit
            allowedFormats: ["mp4", "mov", "avi"], // Restrict to common video formats
          },
          (err, result) => {
            if (err) {
              console.error("Cloudinary Upload Error:", err);
            } else if (result.event === "success") {
              console.log("Uploaded Video:", result.info);
              const updatedVideos = [...videoURLs, result.info.secure_url];
              setVideoURLs(updatedVideos);
              onVideoUpdate(updatedVideos); // Notify parent component
            }
          }
        );
      };
      document.body.appendChild(script);
    };

    loadCloudinary();
  }, [videoURLs, onVideoUpdate]);

  return (
    <div className="flex flex-col items-center">
      {videoURLs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center w-full max-w-sm p-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:border-blue-600 transition"
          onClick={() => widgetRef.current?.open()}
        >
          <AiOutlineCloudUpload className="text-blue-500 mb-2" size={50} />
          <span className="text-sm text-gray-600">
            Click to upload or drag and drop video
          </span>
        </div>
      ) : (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden group">
          <video
            src={videoURLs[0]}
            controls
            className="w-full h-64 object-cover"
          />
          <button
            onClick={() => deleteVideo(0)}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <MdClose size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

UploadVideo.propTypes = {
  onVideoUpdate: PropTypes.func.isRequired,
};

export default UploadVideo;
