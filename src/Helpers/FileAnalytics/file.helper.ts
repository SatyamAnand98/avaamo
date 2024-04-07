import fs from "fs";
import path from "path";
import ReadFiles from "../logics/readTextFromFile";
import { HelperAbstract } from "../../stores/abstracts/helper.abstracts";
import { UploadedFileModel } from "../../Databases/mongoDB/models/uploadedFile.model";
import { sendEmail } from "../logics/sendEmail";
import ejs from "ejs";
import { saveBufferToS3 } from "../logics/saveBufferToFile";
import { callAxios, callFetch } from "../../APIs";
import { getSynonyms } from "../logics/getPrepositions";
import { wordCount } from "../logics/word.count";
import { EPurpose } from "../../stores/enums/purpose.enum";

const successHtmlPath = path.resolve(__dirname, "../../stores/htmls");
const successHtml = fs.readFileSync(
    `${successHtmlPath}/fileUpload.success.ejs`,
    "utf8"
);
const failedHtml = fs.readFileSync(
    `${successHtmlPath}/fileUpload.failed.ejs`,
    "utf8"
);

/**
 * Service class for file activities.
 */
class FileActivityService extends HelperAbstract {
    constructor() {
        super();
    }

    async uniqueWords(
        files: Express.Multer.File[],
        email: string
    ): Promise<any> {
        try {
            const textInFiles = await ReadFiles.readTextFromAll(files);

            const uploadFiles = files.map((file) => {
                return new UploadedFileModel({
                    fileName:
                        file.originalname.split(".")[0] +
                        "-" +
                        Date.now() +
                        "." +
                        file.originalname.split(".")[1],
                    originalName: file.originalname,
                    encoding: file.encoding,
                    mimeType: file.mimetype,
                    buffer: file.buffer,
                    size: file.size,
                    email,
                    purpose: EPurpose.UNIQUE_WORDS,
                });
            });

            UploadedFileModel.insertMany(uploadFiles)
                .then((result) => {
                    const htmlData = ejs.render(successHtml, {
                        textInFiles,
                    });

                    sendEmail({
                        to: email,
                        subject: "Files received successfully!",
                        text: "",
                        html: htmlData,
                    });
                })
                .catch((err: any) => {
                    console.log(
                        `Error in file upload .catch block: ${err.message}`.trim() +
                            "\n"
                    );
                    const htmlData = ejs.render(failedHtml, {
                        errorMessage: err.message,
                    });
                    sendEmail({
                        to: email,
                        subject: "Error in file upload!",
                        text: "",
                        html: htmlData,
                    });
                });

            return textInFiles;
        } catch (err: any) {
            console.log(
                `Error in file upload helper: ${err.message}`.trim() + "\n"
            );
            throw err;
        } finally {
            this.deleteFiles(files);
        }
    }

    async findSynonyms(
        words: string[],
        file: Express.Multer.File,
        email: string
    ): Promise<any> {
        try {
            const synonymsResponses: any[] = [];
            const fileText = await ReadFiles.readTextFromAll([file]);

            new UploadedFileModel({
                fileName:
                    file.originalname.split(".")[0] +
                    "-" +
                    Date.now() +
                    "." +
                    file.originalname.split(".")[1],
                originalName: file.originalname,
                encoding: file.encoding,
                mimeType: file.mimetype,
                buffer: file.buffer,
                size: file.size,
                email,
                purpose: EPurpose.SYNONYMS,
                words,
            }).save();

            for (const word of words) {
                if (!process.env.YANDEX_API || !process.env.YANDEX_KEY) {
                    throw new Error("Yandex properties not found");
                }

                const url =
                    process.env.YANDEX_API +
                    "?" +
                    new URLSearchParams({
                        key: process.env.YANDEX_KEY,
                        lang: "en-en",
                        text: word,
                    }).toString();

                const data = await callFetch({
                    method: "GET",
                    url: url,
                    contentType: "application/json",
                });

                const jsonData: any = JSON.parse(data);

                if (Array.isArray(jsonData.def)) {
                    synonymsResponses.push({
                        [file.originalname]: {
                            word,
                            wordCount: wordCount(fileText[0].text, word),
                            synonyms: getSynonyms(jsonData.def),
                        },
                    });
                }
            }

            return synonymsResponses;
        } catch (err: any) {
            console.log(
                `Error in findSynonyms helper: ${err.message}`.trim() + "\n"
            );
            throw err;
        } finally {
            this.deleteFiles([file]);
        }
    }

    async wordMasking(
        words: string[],
        file: Express.Multer.File,
        email: string
    ): Promise<any> {
        try {
            let maskedContent = file.buffer.toString();
            words.forEach((word) => {
                maskedContent = maskedContent.replace(
                    new RegExp(`\\b${word}\\b`, "gi"),
                    "*".repeat(word.length)
                );
            });

            const maskedFile: Express.Multer.File = {
                ...file,
                buffer: Buffer.from(maskedContent),
            };

            const filesPath: string[] = saveBufferToS3([maskedFile]);

            new UploadedFileModel({
                fileName:
                    file.originalname.split(".")[0] +
                    "-" +
                    Date.now() +
                    "." +
                    file.originalname.split(".")[1],
                originalName: file.originalname,
                encoding: file.encoding,
                mimeType: file.mimetype,
                buffer: file.buffer,
                size: file.size,
                email,
                purpose: EPurpose.WORD_MASKING,
                words,
                fileUrl: filesPath[0],
            }).save();

            return filesPath;
        } catch (err: any) {
            console.log(
                `Error in wordMasking helper: ${err.message}`.trim() + "\n"
            );
            throw err;
        } finally {
            this.deleteFiles([file]);
        }
    }

    private async deleteFiles(files: Express.Multer.File[]): Promise<any> {
        for (const file of files) {
            if (file?.path) {
                const filePath = path.join(__dirname, `../../${file.path}`);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    // await fs.promises.rm(path.join(__dirname, "../../uploads"), {
                    //     force: true,
                    //     recursive: true,
                    // });
                }
            }
        }
    }
}

const fileActivityService = new FileActivityService();
export default fileActivityService;
