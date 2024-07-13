import express from 'express';
import { create, deleteUnit, getAllUnits, getCourseProgress, getOneUnit, getUnits, updateUnitById } from '../controllers/unit';


const router = express.Router();

router.post("/units/create", create)
router.put("/units/:id", updateUnitById)
router.get("/units/:id", getOneUnit)
router.delete("/units/:id", deleteUnit)
router.get("/units", getAllUnits)



router.post("/get-units", getUnits)
router.post("/get-course-progress", getCourseProgress)


export default router


