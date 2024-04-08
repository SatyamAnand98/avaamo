import { Schema, model } from "mongoose";
import { EPurpose } from "../../../stores/enums/purpose.enum";

/**
 * Define the interface for the UploadedFile document
 */
interface IUploadedFileDocument {
    fileName: string;
    originalName: string;
    encoding: string;
    mimeType: string;
    buffer: Buffer;
    size: number;
    email: string;
    purpose: EPurpose;
    words: string[];
    fileUrl: string;
}

/**
 * Represents the schema for a file in the MongoDB database.
 */
const uploadedFileSchema = new Schema<IUploadedFileDocument>(
    {
        fileName: { type: String, required: true, index: true },
        originalName: { type: String, required: true },
        encoding: { type: String, required: true },
        mimeType: { type: String, required: true },
        buffer: { type: Buffer, required: true },
        size: { type: Number, required: true },
        email: { type: String, required: true, index: true },
        purpose: {
            type: String,
            required: false,
            enum: Object.values(EPurpose),
        },
        words: { type: [String], required: false },
        fileUrl: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

export { IUploadedFileDocument, uploadedFileSchema };
