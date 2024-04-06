import { Response } from "express";
import { E_HTTP_STATUS_CODE } from "../../stores/enums/HTTP_Status";
import { IErrorResponse } from "../../stores/interfaces/response.interface";

class ResponseHandler {
    /**
     * Handles errors and sends an error response to the client.
     * @param res - The response object.
     * @param err - The error object.
     * @param message - Optional message to include in the error response.
     */
    protected _errorHandler = (
        res: Response,
        err: any,
        message: string | null = null
    ): void => {
        const errorResponse: IErrorResponse = {
            data: null,
            message: message ?? err.message,
            metaData: {
                status: err.status ?? E_HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                error: true,
            },
        };
        res.status(err.status ?? E_HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(
            errorResponse
        );
    };

    /**
     * Handles the success response for API requests.
     *
     * @param res - The response object.
     * @param data - The data to be included in the response.
     * @param message - The message to be included in the response.
     * @param status - The HTTP status code for the response.
     */
    protected _successHandler = (
        res: Response,
        data?: Record<any, any> | null,
        message?: string,
        status: E_HTTP_STATUS_CODE = E_HTTP_STATUS_CODE.OK
    ): void => {
        const successResponse: IErrorResponse = {
            data: data ?? null,
            message: message ?? "Success",
            metaData: {
                status: status,
                error: false,
            },
        };

        res.status(status).send(successResponse);
    };
}

export default ResponseHandler;
