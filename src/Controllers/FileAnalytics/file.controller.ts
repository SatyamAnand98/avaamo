import { Request, Response } from "express";
import fileActivityService from "../../Helpers/FileAnalytics/file.helper";
import { E_HTTP_STATUS_CODE } from "../../stores/enums/HTTP_Status";
import { ControllerAbstract } from "../../stores/abstracts/controller.abstracts";
import {
    uniqueWordSchemaValidator,
    wordSchemaValidator,
} from "../validators/files.validator";
import dotenv from "dotenv";

dotenv.config();

/**
 * Controller class for handling file activities.
 */
export class FileActivityController extends ControllerAbstract {
    /**
     * Represents a FileController.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Retrieves the unique words from the uploaded files and send an email on the given email.
     *
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @returns A Promise that resolves to void.
     */
    async uniqueWords(req: Request, res: Response): Promise<void> {
        try {
            const files: Express.Multer.File[] =
                req.files as Express.Multer.File[];
            const email: string = req.body.email;

            const data = await uniqueWordSchemaValidator.validateAsync({
                email,
                files,
            });

            const result = await fileActivityService.uniqueWords(
                data.files,
                data.email
            );

            super._successHandler(
                res,
                result,
                "File uploaded successfully",
                E_HTTP_STATUS_CODE.CREATED
            );
        } catch (err: any) {
            console.error(
                `Error in file upload controller: ${err}`.trim() + "\n"
            );
            super._errorHandler(res, err);
        }
    }

    /**
     * Finds synonyms for the given words in the provided file.
     *
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @returns A Promise that resolves to void.
     */
    async findSynonyms(req: Request, res: Response): Promise<void> {
        try {
            const words: string[] = req.body.words
                .split(",")
                .map((word: string) => word.trim());
            const email: string = req.body.email;
            const file: Express.Multer.File = req.file as Express.Multer.File;

            const data = await wordSchemaValidator.validateAsync({
                email,
                words,
                file,
            });

            const result = await fileActivityService.findSynonyms(
                data.words,
                data.file,
                data.email
            );

            super._successHandler(
                res,
                result,
                "File analytics generated successfully",
                E_HTTP_STATUS_CODE.OK
            );
        } catch (err) {
            super._errorHandler(res, err);
        }
    }

    /**
     * Handles the word masking operation.
     *
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async wordMasking(req: Request, res: Response) {
        try {
            const words: string[] = req.body.words
                .split(",")
                .map((word: string) => word.trim());
            const email: string = req.body.email;
            const file: Express.Multer.File = req.file as Express.Multer.File;

            const allowedFileTypes = ["text/plain"];
            const fileMimeType = file.mimetype;
            if (!allowedFileTypes.includes(fileMimeType)) {
                throw new Error("Only text files are allowed");
            }

            const data = await wordSchemaValidator.validateAsync({
                email,
                words,
                file,
            });

            /**
             * Array of strings, which has path of the files representing the result of the word masking operation.
             */
            const result: string[] = await fileActivityService.wordMasking(
                data.words,
                data.file,
                data.email
            );

            super._successHandler(
                res,
                result,
                "Word masking operation completed successfully",
                E_HTTP_STATUS_CODE.OK
            );
        } catch (err) {
            super._errorHandler(res, err);
        }
    }
}

const fileActivityController = new FileActivityController();
export default fileActivityController;
