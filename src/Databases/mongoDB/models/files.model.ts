import { Schema, model, Document } from "mongoose";

/**
 * Define the interface for the WordCounts embedded document
 */
interface WordCount {
    word: string;
    count: number;
}

/**
 * Define the interface for the File document
 */
interface FileDocument extends Document {
    fileName: string;
    fileSize: number;
    uploadDate: Date;
    maskedContent: string;
    wordCounts: WordCount[];
}

/**
 * Represents the schema for a file in the MongoDB database.
 */
const fileSchema = new Schema<FileDocument>(
    {
        fileName: { type: String, required: true },
        fileSize: { type: Number, required: true },
        uploadDate: { type: Date, default: Date.now },
        maskedContent: { type: String, required: true },
        wordCounts: [{ word: String, count: Number }],
    },
    {
        timestamps: true,
    }
);

/**
 * Define the model for the File collection
 */
const FileModel = model<FileDocument>("File", fileSchema);

export { FileModel, FileDocument, WordCount };
