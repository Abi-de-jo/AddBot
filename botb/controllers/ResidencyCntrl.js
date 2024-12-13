import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";


export const createResidency = asyncHandler(async (req, res) => {
    const {
      title,
      address,
      metro,
      district,
      price,
      discount,
      commission,
      propertyType,
       selectedAdditional,
      residencyType,
      termDuration,
      term,
      rooms,
      city,
      area,
      type,
      parking,
      bathrooms,
      floor,
      totalFloors,
      balcony,
      amenities,
      heating,
      description,
      video,
      images, // Ensure this is an array
    } = req.body.secondFormData;
  
    const userEmail = req.body.email;
  
    // Log the incoming request to verify structure
    console.log("Request body:", req.body);
    console.log("User email:", userEmail);
  
    // Validate input
    if (!userEmail) {
      return res.status(400).json({ message: "User email is required." });
    }
  
    // Ensure images is an array
    const imageArray = Array.isArray(images) ? images : [];
  
    try {
      const residency = await prisma.residency.create({
        data: {
          title,
          address,
          metro,
          heating,
          district,
          price,
          selectedAdditional,
           discount,
          commission,
          propertyType,
          residencyType,
          rooms,
          termDuration,
          term,
          bathrooms,
          floor,
          totalFloors,
          area,
          type,
          parking,
          city,
          balcony,
          amenities,
          description,
          video,
          status: "published",
          images: imageArray,
          userEmail, // Relates the residency to the user via userEmail
        },
      });
  
      return res.json({ message: "Residency created successfully", residency });
    } catch (err) {
      console.error("Error creating residency:", err);
  
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ message: "A residency with this address already exists." });
      }
  
      return res.status(500).json({ message: err.message });
    }

    console.log(req.body);
  });
  
export const getAllResidency = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany();
    res.json(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});

export const getResidency = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const residency = await prisma.residency.findUnique({
      where: {
        id: id,
      },
    });
    res.json(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});

export const updateResidency = asyncHandler(async (req, res) => {
  const { id } = req.params; // Residency ID
  const data = req.body; // Property data from frontend
  console.log(req.body);

  try {
    const residency = await prisma.residency.update({
      where: { id: id },
      data: {
        title: data.title,
        price: parseFloat(data.price),
        discount: parseFloat(data.discount),
        description: data.description,
        address: data.address,
        district: data.district,
        type: data.type,
        metro: data.metro,
        images: data.images, // Make sure images are properly handled if using FormData
      },
    });
    res.status(200).json({ message: "Residency updated successfully", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const deleteResidency = async (req, res) => {

  const { id } = req.params;

  try {
    await prisma.residency.delete({
      where: { id: id }
    })
    res.status(200).json({ message: "residency deleted successfully" })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get residency" })
  }
}
