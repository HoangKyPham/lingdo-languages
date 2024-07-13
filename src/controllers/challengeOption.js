import { StatusCodes } from "http-status-codes";
import ChallengeOption from "../models/challengeOptionModel"

export const create = async (req, res) => {
    try {
        const challengeOption = await ChallengeOption.create(req.body);

        return res.status(StatusCodes.CREATED).json(challengeOption);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const updateChallengeOptionById = async (req, res) => {
    try {
        const data = await ChallengeOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json(data);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getOneChallengeOption = async (req, res) => {
    try {
        const ChallengeOptionId  = req.params
        const data = await ChallengeOption.findById({ _id: ChallengeOptionId.id });

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

export const deleteChallengeOption = async (req, res) => {
    try {
        const ChallengeOptionId  = req.params
        const data = await ChallengeOption.findByIdAndDelete({ _id: ChallengeOptionId.id });

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

export const getAllChallengeOptions = async (req, res) => {
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

        const result = await ChallengeOption.paginate(parsedFilter, options);

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


