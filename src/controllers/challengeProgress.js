import { StatusCodes } from "http-status-codes";
import ChallengeProgress from "../models/challengeProgressModel"


export const create = async (req, res) => {
    try {
        const challengeProgress = await ChallengeProgress.create(req.body);

        return res.status(StatusCodes.CREATED).json(challengeProgress);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const existingChallengeProgress = async (req, res) => {
    try {
        const { challengeId, emailAddress } = req.body
        console.log(challengeId, emailAddress)

        const challengeProgress = await ChallengeProgress.findOne({
            email: emailAddress,
            activeChallenge: challengeId
        });
        if (challengeProgress.length === 0)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy bài học đã hoàn thành nào nào!" });


         console.log(challengeProgress)
                
        return res.status(StatusCodes.OK).json({
            challengeProgress
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const updateChallengeProgress = async (req, res) => {
    try {
        const { existingChallengeProgressId, completed } = req.body
        console.log(existingChallengeProgressId)
        const updatedChallengeProgress = await ChallengeProgress.findByIdAndUpdate(
            existingChallengeProgressId,
            { completed },
            { new: true }
        );
        if (updatedChallengeProgress.length === 0)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy bài học đã hoàn thành nào nào!" });

        console.log(updatedChallengeProgress)

        return res.status(StatusCodes.OK).json({
            updatedChallengeProgress
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

