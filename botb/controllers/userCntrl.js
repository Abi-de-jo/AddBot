import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const createUser = asyncHandler(async (req, res) => {
  let {username,teleNumber,email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    const isAgent = email.includes("geomap");

    if (userExists) {
      const isValidPassword = await bcrypt.compare(password, userExists.password);

      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Failed to login: Invalid password" });
      } else {
        const { password: userPassword, ...userInfo } = userExists;

        if(email == "david@gmail.com") {
          return res.status(200).json({
            message: "Admin",
            admin: userInfo,
          });
        }

        if (isAgent) {
          return res.status(200).json({
            message: "Agent",
            agent: userInfo,
          });
        }

        return res.status(200).json({
          message: "Logged in successfully",
          user: userInfo,
        });
      }
    }

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {username: username, teleNumber:teleNumber  ,email: email, password: hashedPassword },
      });
      if (email == "david@gmail.com") {
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
