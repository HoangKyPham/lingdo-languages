import express from 'express';
import { create, deleteLesson, getAllLessons, getLesson, getOneLesson, updateLessonById } from '../controllers/lesson';


const router = express.Router();

router.post("/lessons/create", create)
router.put("/lessons/:id", updateLessonById)
router.get("/lessons/:id", getOneLesson)
router.delete("/lessons/:id", deleteLesson)
router.get("/lessons", getAllLessons)


router.post("/get-lesson", getLesson)


export default router


