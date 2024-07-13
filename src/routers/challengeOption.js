import express from 'express';
import { create, deleteChallengeOption, getAllChallengeOptions, getOneChallengeOption, updateChallengeOptionById } from '../controllers/challengeOption';


const router = express.Router();

router.post("/challenge-option/create", create)
router.put("/challenge-option/:id", updateChallengeOptionById)
router.get("/challenge-option/:id", getOneChallengeOption)
router.delete("/challenge-option/:id", deleteChallengeOption)
router.get("/challenge-option", getAllChallengeOptions)

export default router


