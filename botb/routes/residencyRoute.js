import express from "express";
import {  createResidency, getAllResidency,publishResidency, getResidency, deleteResidency, updateResidency, getAllDraftResidencies, updateResidencyDate, acceptResidency,  } from "../controllers/ResidencyCntrl.js";
const router = express.Router();

router.put("/updateDate/:id", updateResidencyDate);

router.post("/create", createResidency);
router.put("/update/:id", updateResidency);
router.put("/accept/:id", acceptResidency);

router.get("/allres", getAllResidency);
router.get("/alldrafts", getAllDraftResidencies);
router.post("/publish/id", publishResidency);
router.get("/:id", getResidency);
router.delete("/delete/:id", deleteResidency);




export {router as residencyRoute}