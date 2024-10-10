import { Response } from 'express';

export const sendErrorResponse = (
    res: Response,
    statusCode: number,
    message: string,
    code: string
) => {
    return res.status(statusCode).json({
        status: 'fail',
        message,
        content: { code }
    });
};


export const sendSuccessResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data: any
) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        content: data
    });
};

export const  sendResponseIfNeeded = (res: Response, statusCode: number, message: string, data: any = null) => {
    if (!res.headersSent) {
        if (statusCode >= 400) {
            sendErrorResponse(res, statusCode, message, data);
        } else {
            sendSuccessResponse(res, statusCode, message, data);
        }
    }
}
