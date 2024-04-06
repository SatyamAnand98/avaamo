import { Request, Response } from "express";
import { E_HTTP_STATUS_CODE } from "../enums/HTTP_Status";
import { IErrorResponse } from "../interfaces/response.interface";

/**
 * Represents a controller interface for handling file operations and analytics.
 */
interface IController {
    /**
     * Handles file upload request.
     * @param req - The request object.
     * @param res - The response object.
     */
    uniqueWords(req: Request, res: Response): Promise<void>;

    /**
     * Handles file analytics request.
     * @param req - The request object.
     * @param res - The response object.
     */
    findSynonyms(req: Request, res: Response): Promise<void>;

    /**
     * Handles word masking request.
     * @param req - The request object.
     * @param res - The response object.
     */
    wordMasking(req: Request, res: Response): Promise<void>;
}

/**
 * Abstract class representing a controller.
 * Provides common methods for handling API requests and responses.
 */
abstract class ControllerAbstract implements IController {
    abstract uniqueWords(req: Request, res: Response): Promise<void>;
    abstract findSynonyms(req: Request, res: Response): Promise<void>;
    abstract wordMasking(req: Request, res: Response): Promise<void>;

    /**
     * Handles errors and sends an error response to the client.
     * @param res - The response object.
     * @param err - The error object.
     * @param message - Optional message to include in the error response.
     */
    protected _errorHandler(
        res: Response,
        err: any,
        message: string | null = null
    ): void {
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
    }

    /**
     * Handles the success response for API requests.
     *
     * @param res - The response object.
     * @param data - The data to be included in the response.
     * @param message - The message to be included in the response.
     * @param status - The HTTP status code for the response.
     */
    protected _successHandler(
        res: Response,
        data?: Record<any, any> | null,
        message?: string,
        status: E_HTTP_STATUS_CODE = E_HTTP_STATUS_CODE.OK
    ): void {
        const successResponse: IErrorResponse = {
            data: data ?? null,
            message: message ?? "Success",
            metaData: {
                status: status,
                error: false,
            },
        };

        res.status(status).send(successResponse);
    }
}

export { IController, ControllerAbstract };
