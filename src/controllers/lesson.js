import { StatusCodes } from "http-status-codes";
import Lesson from "../models/lessonModel"
import Challenge from "../models/challengeModel"
import ChallengeOption from "../models/challengeOptionModel"
import ChallengeProgress from "../models/challengeProgressModel"

export const create = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);

        return res.status(StatusCodes.CREATED).json(lesson);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const updateLessonById = async (req, res) => {
    try {
        const data = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json(data);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getOneLesson = async (req, res) => {
    try {
        const LessonId  = req.params
        const data = await Lesson.findById({ _id: LessonId.id });

        if (!data)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy khóa học nào!" });

        return res.status(StatusCodes.OK).json({
            data
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const LessonId  = req.params
        const data = await Lesson.findByIdAndDelete({ _id: LessonId.id });

        console.log(data);

        if (!data)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy khóa học nào!" });

        return res.status(StatusCodes.OK).json({
            data
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getAllLessons = async (req, res) => {
    try {
        const { filter = '{}', range = '[0,9]', sort = '["id","ASC"]' } = req.query;

        // Phân tích các tham số từ chuỗi JSON
        const parsedFilter = JSON.parse(filter);
        const parsedRange = JSON.parse(range);
        const parsedSort = JSON.parse(sort);

        // Tính toán các giá trị phân trang
        const _page = Math.floor(parsedRange[0] / (parsedRange[1] - parsedRange[0] + 1)) + 1;
        const _limit = parsedRange[1] - parsedRange[0] + 1;
        const _sort = parsedSort[0];
        const _order = parsedSort[1].toLowerCase();

        const options = {
            page: _page,
            limit: _limit,
            sort: _sort,
        };

        const result = await Lesson.paginate(parsedFilter, options);

        if (result.docs.length === 0)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy khóa học nào!" });

        // Thiết lập header Content-Range cho phản hồi
        const totalItems = result.totalDocs;
        const startRange = (result.page - 1) * result.limit;
        const endRange = startRange + result.docs.length - 1;

        res.setHeader('Content-Range', `${startRange}-${endRange}/${totalItems}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');

        const response = {
            data: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalItems: result.totalDocs,
            },
        };

        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};




export const getLesson = async (req, res) => {
    try {
        const { lessonId, emailAddress } = req.body
        const lesson = await Lesson.findById(lessonId).lean();

        if (!lesson) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Lesson not found" });
        }

        // Find the challenges for the lesson, sorted by the 'order' field
        const challenges = await Challenge.find({ activeLesson: lessonId }).sort({ order: 1 }).lean();

        for (let challenge of challenges) {
            const challengeId = challenge._id.toString();

            // Find the challenge options for each challenge
            const challengeOptions = await ChallengeOption.find({ activeChallenge: challengeId }).lean();

            // Find the challenge progress for each challenge and specific user
            const challengeProgresses = await ChallengeProgress.findOne({ activeChallenge: challengeId, email : emailAddress }).lean();

            // Add challengeOptions and challengeProgresses to the challenge object
            challenge.challengeOptions = challengeOptions;
            challenge.challengeProgresses = challengeProgresses;
        }

        // Add the challenges to the lesson object
        lesson.challenges = challenges;

        if (lesson.length === 0)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy học phần nào!" });
        return res.status(StatusCodes.OK).json({
            lesson
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

