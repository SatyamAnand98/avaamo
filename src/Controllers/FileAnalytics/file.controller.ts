import { Request, Response } from "express";
import fileActivityService from "../../Helpers/FileAnalytics/file.helper";
import { E_HTTP_STATUS_CODE } from "../../stores/enums/HTTP_Status";
import { ControllerAbstract } from "../../stores/abstracts/controller.abstracts";
import {
    uniqueWordSchemaValidator,
    wordSchemaValidator,
} from "../validators/files.validator";

/**
 * Controller class for handling file activities.
 */
class FileActivityController extends ControllerAbstract {
    constructor() {
        super();
    }

    /**
     * Handles the uniqueWords functionality.
     *
     * @param req - The request object.
     * @param res - The response object.
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
            console.log(
                `Error in file upload controller: ${err}`.trim() + "\n"
            );
            super._errorHandler(res, err);
        }
    }

    /**
     * Handles the findSynonyms functionality.
     *
     * @param req - The request object.
     * @param res - The response object.
     */
    async findSynonyms(req: Request, res: Response): Promise<void> {
        try {
            const words: string[] = req.body.words
                .split(",")
                .map((word: string) => word.trim());
            const email: string = req.body.email;
            const files: Express.Multer.File[] =
                req.files as Express.Multer.File[];

            const data = await wordSchemaValidator.validateAsync({
                email,
                words,
                files,
            });

            const result = await fileActivityService.findSynonyms(
                data.words,
                data.files,
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
     * Handles the word masking functionality.
     *
     * @param req - The request object.
     * @param res - The response object.
     */
    async wordMasking(req: Request, res: Response) {
        try {
            const words: string[] = req.body.words
                .split(",")
                .map((word: string) => word.trim());
            const email: string = req.body.email;
            const files: Express.Multer.File[] =
                req.files as Express.Multer.File[];

            const data = await wordSchemaValidator.validateAsync({
                email,
                words,
                files,
            });

            /**
             * Array of strings, which has path of the files representing the result of the word masking operation.
             */
            const result: string[] = await fileActivityService.wordMasking(
                data.words,
                data.files,
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
