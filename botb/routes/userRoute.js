import express from "express";
import {allLikes, createUser, dislikes, getuser, getusers, likes} from "../controllers/userCntrl.js";
 
const router = express.Router();




router.post("/register", createUser );
router.post("/likes/:id", likes);
router.delete("/dislikes/:id",dislikes);
router.post("/allLikes", allLikes);
router.get("/allusers", getusers);
router.post("/get", getuser);
<<<<<<< HEAD


=======
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713







export {router as userRoute}
