import mongoose from "mongoose";
import {
    IUploadedFileDocument,
    uploadedFileSchema,
} from "./uploadedFile.model";

/**
 * Creates and returns the database models for MongoDB.
 * @param models - The mongoose connection object.
 * @returns An object containing the created database models.
 */
export const createDBModels = (models: mongoose.Connection) => {
    let uploadedFileModel: mongoose.Model<IUploadedFileDocument> = models.model(
        "UploadedFile",
        uploadedFileSchema
    );

    return {
        uploadedFileModel,
    };
};
