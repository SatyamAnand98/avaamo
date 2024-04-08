import mongoose from "mongoose";
import {
    IUploadedFileDocument,
    uploadedFileSchema,
} from "./uploadedFile.model";

export const createDBModels = (models: mongoose.Connection) => {
    let uploadedFileModel: mongoose.Model<IUploadedFileDocument> = models.model(
        "UploadedFile",
        uploadedFileSchema
    );

    return {
        uploadedFileModel,
    };
};
