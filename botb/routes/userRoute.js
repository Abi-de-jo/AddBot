import express from "express";
import {allLikes, createUser, dislikes, getuser, getusers, likes} from "../controllers/userCntrl.js";
 
const router = express.Router();




router.post("/register", createUser );
router.post("/likes/:id", likes);
router.delete("/dislikes/:id",dislikes);
router.post("/allLikes", allLikes);
router.get("/allusers", getusers);
router.post("/get", getuser);







export {router as userRoute}
