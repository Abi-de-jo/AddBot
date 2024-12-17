import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
 



export const createUser = asyncHandler(async (req, res) => {
  let {username, teleNumber, surname } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { teleNumber: teleNumber },
    });

  
      if (userExists) {
        if(userExists.email){
          const isAgent = userExists.email.includes("geomap");
        }
          if(userExists.email.includes("david")) {
            return res.status(200).json({
              message: "Admin",
              admin: userExists,
            });
          }
  
          if (isAgent) {
            return res.status(200).json({
              message: "Agent",
              agent: userExists,
            });
          }

    
    

        return res.status(200).json({
          message: "Logged in successfully",
          user: userExists,
        });
      }

    if (!userExists) {

      const newUser = await prisma.user.create({
        data: {username: username, surname: surname, teleNumber:teleNumber},
      });
      if (teleNumber.includes("david")) {
        return res.status(201).json({
          message: "Admin",
          admin: newUser,
        });
      }

      if (isAgent) {
        return res.status(201).json({
          message: "Agent",
          agent: newUser,
        });
      }

      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

 
export const likes = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const alreadyLiked = await prisma.user.findUnique({
      where: { email: email },
      select: { favoriteResidency: true },
    });

    if (!alreadyLiked) {
      return res.status(404).json({ message: "User not found" });
    }

    if (alreadyLiked.favoriteResidency.some((visit) => visit.id === id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        favoriteResidency: { push: id },
      },
    });

    res.json("Liked");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to Like" });
  }
});

export const dislikes = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { favoriteResidency: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favoriteResidency.includes(id)) {
      return res.status(400).json({ message: "Removed like" });
    }

    // Rename the callback parameter to avoid shadowing the outer id.
    const updatedFavorites = user.favoriteResidency.filter(
      (residencyId) => residencyId !== id
    );

    await prisma.user.update({
      where: { email: email },
      data: { favoriteResidency: updatedFavorites },
    });

    console.log("Likes removed successfully.");
    res.json({ message: "Removed likes successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove like" });
  }
});

export const allLikes = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const likes = await prisma.user.findUnique({
      where: { email: email },
      select: { favoriteResidency: true },
    });
    res.status(200).json(likes.favoriteResidency);
  } catch (err) {
    throw new Error(err.message);
  }
});
export const getusers = asyncHandler(async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to get Users"})
    }
})
export const getuser = asyncHandler(async (req, res) => {
    const {email} = req.body; 
  console.log(email)

    try {
        const user = await prisma.user.findUnique({
            where: {email: email}
        });
        console.log(user)
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to get Users"})
    }
})


export const updateUserEmail = async ( req,res) => {
  const {userId,email} = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        teleNumber: userId,
      },
      data: {
        email: email,
      },
    });
    console.log('User email updated:', updatedUser);
        res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
   
  }
};
