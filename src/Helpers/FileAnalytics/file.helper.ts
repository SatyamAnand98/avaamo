import fs from "fs";
import path from "path";
import ReadFiles from "../logics/readTextFromFile";
import { HelperAbstract } from "../../stores/abstracts/helper.abstracts";
import { UploadedFileModel } from "../../Databases/mongoDB/models/uploadedFile.model";
import { sendEmail } from "../logics/sendEmail";
import ejs from "ejs";
import { saveBufferToS3 } from "../logics/saveBufferToFile";
import { callAxios, callFetch } from "../../APIs";

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
            await this.deleteFiles(files);
        }
    }

    async findSynonyms(
        words: string[],
        files: Express.Multer.File[],
        email: string
    ): Promise<any> {
        try {
            if (!process.env.YANDEX_API || !process.env.YANDEX_KEY) {
                throw new Error("Yandex properties not found");
            }

            /**
             * Example Call:
             * https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=time
             */
            const data = await callFetch({
                method: "GET",
                url: process.env.YANDEX_API,
                contentType: "application/json",
            });

            console.log(data.status);

            return data;
        } catch (err: any) {
            console.log(
                `Error in findSynonyms helper: ${err.message}`.trim() + "\n"
            );
            throw err;
        } finally {
            await this.deleteFiles(files);
        }
    }

    async wordMasking(
        words: string[],
        files: Express.Multer.File[],
        email: string
    ): Promise<any> {
        try {
            const maskedFiles: Express.Multer.File[] = [];

            for (const file of files) {
                let maskedContent = file.buffer.toString();
                // Iterate through each word in the array and mask it
                words.forEach((word) => {
                    // Replace all occurrences of the current word with '*'
                    maskedContent = maskedContent.replace(
                        new RegExp(`\\b${word}\\b`, "gi"),
                        "*".repeat(word.length)
                    );
                });

                // Create a new file object with the masked content
                const maskedFile: Express.Multer.File = {
                    ...file,
                    buffer: Buffer.from(maskedContent),
                };

                maskedFiles.push(maskedFile);
            }

            const filesPath: string[] = saveBufferToS3(maskedFiles);
            return filesPath;
        } catch (err: any) {
            console.log(
                `Error in wordMasking helper: ${err.message}`.trim() + "\n"
            );
            throw err;
        } finally {
            await this.deleteFiles(files);
        }
    }

    private async deleteFiles(files: Express.Multer.File[]): Promise<any> {
        for (const file of files) {
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

const fileActivityService = new FileActivityService();
export default fileActivityService;
