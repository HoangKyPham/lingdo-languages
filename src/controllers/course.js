import { StatusCodes } from "http-status-codes";
import Course from "../models/courseModel";

export const create = async (req, res) => {
    try {
        const course = await Course.create(req.body);

        return res.status(StatusCodes.CREATED).json(course);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const updateCourseById = async (req, res) => {
    try {
        const data = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json(data);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getOneCourse = async (req, res) => {
    try {
        const courseId  = req.params
        const data = await Course.findById({ _id: courseId.id });

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

export const deleteCourse = async (req, res) => {
    try {
        const courseId  = req.params
        const data = await Course.findByIdAndDelete({ _id: courseId.id });

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

export const getAllCourses = async (req, res) => {
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

        const result = await Course.paginate(parsedFilter, options);

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




export const getCoursesById = async (req, res) => {
    try {
        const { courseId } = req.body
        const course = await Course.findById({ _id: courseId });

        if (!course)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy khóa học nào!" });

        return res.status(StatusCodes.OK).json({
            course
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getCourses = async (req, res) => {
    try {
        console.log(1)
        console.log(req.query)
        const courses = await Course.find();
        if (courses.length === 0)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy khóa học nào!" });
        return res.status(StatusCodes.OK).json({
            courses
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};





