import express from 'express';
import { create, deleteCourse, getAllCourses, getCourses, getCoursesById, getOneCourse, updateCourseById } from '../controllers/course';

const router = express.Router();


router.post("/courses/create", create)
router.put("/courses/:id", updateCourseById)
router.get("/courses/:id", getOneCourse)
router.delete("/courses/:id", deleteCourse)
router.get("/courses", getAllCourses)


router.post("/get-course-by-id", getCoursesById)
router.get("/get-courses", getCourses)


export default router


