import { StatusCodes } from "http-status-codes";
import UserSubsctiption from "../models/userSubscriptionModel"
import dateformat from 'dateformat';
import querystring from 'qs';
import crypto from 'crypto';

export const createPaymentUrl = async (req, res, next) => {
    try {
        console.log("1");
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        console.log("2");

        var tmnCode = "LYI631OE"
        var secretKey = "WICQESJ1QY90RDOMV85LTG89PZWO3IWR";
        var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = "https://github.com/HoangKyPham";

        var date = new Date();
        console.log("3");

        var createDate = dateformat(date, 'yyyymmddHHmmss');
        var orderId = dateformat(date, 'HHmmss');
        var amount = "50000";
        var bankCode = "NCB";

        var orderInfo = "Thanh toán lượt làm bài";
        var orderType = "billpayment";
        var locale = "vn";
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        // vnp_Params = sortObject(vnp_Params);
        console.log("4");

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        console.log("5");

        res.redirect(vnpUrl);

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const createUserSubsctiption = async (req, res) => {
    try {
        const course = await UserSubsctiption.create(req.body);

        return res.status(StatusCodes.CREATED).json(course);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getUserSubsctiptionById = async (req, res) => {
    try {
        const {userId} = req.body
        const userSubsctiption = await UserSubsctiption.findOne({userId});
        console.log(userSubsctiption)
        if (userSubsctiption?.length === 0) 
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy người dùng nào!" });
        return res.status(StatusCodes.OK).json({
            userSubsctiption
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};




