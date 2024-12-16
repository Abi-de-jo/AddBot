import express from "express";
import {  createResidency, getAllResidency, getResidency, deleteResidency, updateResidency, publishResidency, getAllAgentDraftResidencies, getAllOwnerDraftResidencies,  } from "../controllers/ResidencyCntrl.js";
const router = express.Router();


router.post("/create", createResidency);
router.put("/update/:id", updateResidency);
router.get("/allres", getAllResidency);
router.get("/allagentdrafts", getAllAgentDraftResidencies);
router.get("/allownerdrafts", getAllOwnerDraftResidencies);
router.post("/publish/:id", publishResidency);
router.get("/:id", getResidency);
router.delete("/delete/:id", deleteResidency);




export {router as residencyRoute}