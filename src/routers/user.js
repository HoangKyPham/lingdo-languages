import express from 'express';
import { getTopTenUser, getUserProgress, insertUserProgress, updateUserProgress } from '../controllers/user';

const router = express.Router();

router.post("/get-user-progress", getUserProgress)
router.patch("/update-user-progress", updateUserProgress)
router.post("/insert-user-progress", insertUserProgress)
router.get("/get-top-users", getTopTenUser)


export default router


