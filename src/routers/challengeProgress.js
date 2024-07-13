import express from 'express';
import { create, existingChallengeProgress, updateChallengeProgress } from '../controllers/challengeProgress';


const router = express.Router();

router.post("/challenge-progress", create)
router.post("/ex-challenge-progress", existingChallengeProgress)
router.patch("/update-challenge-progress", updateChallengeProgress)

export default router


