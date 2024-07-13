import { StatusCodes } from "http-status-codes";
import Unit from "../models/unitModel"
import Lesson from "../models/lessonModel"
import Challenge from "../models/challengeModel"
import ChallengeProgress from "../models/challengeProgressModel"

export const create = async (req, res) => {
    try {
        const unit = await Unit.create(req.body);

        return res.status(StatusCodes.CREATED).json(unit);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};


export const updateUnitById = async (req, res) => {
    try {
        const data = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json(data);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getOneUnit = async (req, res) => {
    try {
        const UnitId  = req.params
        const data = await Unit.findById({ _id: UnitId.id });

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

export const deleteUnit = async (req, res) => {
    try {
        const UnitId  = req.params
        const data = await Unit.findByIdAndDelete({ _id: UnitId.id });

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

export const getAllUnits = async (req, res) => {
    try {
        const {  _page = 1, _limit = 10, _sort = "createdAt", _order = "asc", } = req.query;

        console.log(req.query)

        const options = {
            page: _page,
            limit: _limit,
            sort: _sort,
        };

        console.log(options);

        const result = await Unit.paginate({}, options);

        console.log(result);

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









export const getUnits = async (req, res) => {
    try {
        const { activeCourseId } = req.body;

        console.log(activeCourseId)

        const units = await Unit.find({ activeCourse: activeCourseId });

        const result = [];

        for (let unit of units) {
            const unitId = unit._id.toString();

            const lessons = await Lesson.find({ activeUnit: unitId }).lean();

            for (let lesson of lessons) {
                const lessonId = lesson._id.toString();

                const challenges = await Challenge.find({ activeLesson: lessonId }).lean();

                for (let challenge of challenges) {
                    const challengeId = challenge._id.toString();

                    const challengeProgresses = await ChallengeProgress.find({ activeChallenge: challengeId, completed: true }).lean();

                    challenge.challengeProgresses = challengeProgresses;

                    console.log(challenge);
                }

                lesson.challenges = challenges;
            }

            unit = unit.toObject();
            unit.lessons = lessons;

            result.push(unit);
        }

        if (result.length === 0) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy học phần nào!" });
        }
        return res.status(StatusCodes.OK).json({ result });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getCourseProgress = async (req, res) => {
    try {
        const { activeCourseId, email } = req.body



        // const unitsInActiveCourse = await Unit.find({
        //     activeCourse: activeCourseId
        // })
        //     .sort({ order: 1 })
        //     .populate({
        //         path: 'lessons',
        //         options: { sort: { order: 1 } },  // Sắp xếp các bài học theo thứ tự tăng dần của trường order
        //         populate: {
        //             path: 'challenges',
        //             populate: {
        //                 path: 'challengeProgress',
        //                 match: { userId }  // Lọc tiến trình thử thách cho userId cụ thể
        //             }
        //         }
        //     })
        //     .exec();

        const units = await Unit.find({ activeCourse: activeCourseId }).sort({ order: 1 }).lean();

        const result = [];

        for (let unit of units) {
            const unitId = unit._id.toString();

            // Truy vấn các bài học (lessons) trong mỗi đơn vị học phần
            const lessons = await Lesson.find({ activeUnit: unitId }).sort({ order: 1 }).lean();

            for (let lesson of lessons) {
                const lessonId = lesson._id.toString();

                // Truy vấn các thử thách (challenges) trong mỗi bài học
                const challenges = await Challenge.find({ activeLesson: lessonId }).lean();

                for (let challenge of challenges) {
                    const challengeId = challenge._id.toString();

                    // Truy vấn tiến trình thử thách (challengeProgress) cho mỗi thử thách và userId cụ thể
                    const challengeProgresses = await ChallengeProgress.find({ activeChallenge: challengeId, email }).lean();

                    // Thêm challengeProgress vào challenge
                    challenge.challengeProgresses = challengeProgresses;
                }

                // Thêm challenges vào lesson
                lesson.challenges = challenges;
            }

            // Thêm lessons vào unit
            unit.lessons = lessons;

            // Thêm unit vào kết quả cuối cùng
            result.push(unit);
        }




        console.log(result)

        if (!result)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy học phần nào!" });
        return res.status(StatusCodes.OK).json({
            result
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};