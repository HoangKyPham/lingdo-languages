
import { StatusCodes } from "http-status-codes";
import UserProgress from "../models/userProgressModel";

export const updateUserProgress = async (req, res) => {
    try {
        const { emailAddress, ...dataUpdate } = req.body;

        console.log(dataUpdate, emailAddress);

        const user = await UserProgress.findOneAndUpdate( { email : emailAddress},{ $set : dataUpdate }, { new: true });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }

        console.log(user);        

        return res.status(StatusCodes.OK).json({
            user,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


export const getTopTenUser = async (req, res) => {
    try {
        const data = await UserProgress.find({})
            .sort({ points: -1 }) 
            .limit(10)  
            .select('email userName userImageSrc points')  
            .exec();

        if (data?.length === 0) 
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy người dùng nào!" });
        return res.status(StatusCodes.OK).json({
             data
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const insertUserProgress = async (req, res) => {
    try {

        const user = await UserProgress.create(req.body)

        return res.status(StatusCodes.CREATED).json({
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }

}

export const getUserProgress = async (req, res) => {
    try {
        const { emailAddress } = req.body;

        // Tìm người dùng và populate trường activeCourse
        const user = await UserProgress.findOne({ email : emailAddress }).populate('activeCourse');

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(StatusCodes.CREATED).json({
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
}

// Patch
export const updateIsPracticeUserProgress = async (req, res) => {
    try {
        const { userId, currentUserProgress } = req.body;

        const updatedIsPracticeUser = await UserProgress.findOneAndUpdate(
            { userId: userId },
            {
                hearts: Math.min(currentUserProgress.hearts + 1, 5),
                points: currentUserProgress.points + 10
            },
            { new: true }
        );

        if (!updatedIsPracticeUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(StatusCodes.OK).json({
            updatedIsPracticeUser,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
// Patch
export const updateNotPracticeUserProgress = async (req, res) => {
    try {
        const { userId, currentUserProgress } = req.body;

        const updatedNotPracticeUser = await UserProgress.findOneAndUpdate(
            { userId: userId },
            {
                points: currentUserProgress.points + 10
            },
            { new: true }
        );

        if (!updatedNotPracticeUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(StatusCodes.OK).json({
            updatedNotPracticeUser,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};



