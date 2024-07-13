import express from 'express';
import { create, deleteChallenge, getAllChallenges, getChallenge, getChallengeById, getOneChallenge, updateChallengeById } from '../controllers/challenge';


const router = express.Router();

router.post("/challenges/create", create)
router.put("/challenges/:id", updateChallengeById)
router.get("/challenges/:id", getOneChallenge)
router.delete("/challenges/:id", deleteChallenge)
router.get("/challenges", getAllChallenges)


router.post("/get-challenge", getChallenge)
router.post("/get-challenge-by-id", getChallengeById)

export default router


