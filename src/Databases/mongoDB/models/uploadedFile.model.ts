import { Schema, model } from "mongoose";

/**
 * Define the interface for the UploadedFile document
 */
interface UploadedFileDocument {
    fileName: string;
    originalName: string;
    encoding: string;
    mimeType: string;
    buffer: Buffer;
    size: number;
    email: string;
}

/**
 * Represents the schema for a file in the MongoDB database.
 */
const uploadedFileSchema = new Schema<UploadedFileDocument>(
    {
        fileName: { type: String, required: true, index: true },
        originalName: { type: String, required: true },
        encoding: { type: String, required: true },
        mimeType: { type: String, required: true },
        buffer: { type: Buffer, required: true },
        size: { type: Number, required: true },
        email: { type: String, required: true, index: true },
    },
    {
        timestamps: true,
    }
);

/**
 * Define the model for the UploadedFile collection
 */
const UploadedFileModel = model<UploadedFileDocument>(
    "UploadedFile",
    uploadedFileSchema
);

export { UploadedFileModel, UploadedFileDocument, uploadedFileSchema };
