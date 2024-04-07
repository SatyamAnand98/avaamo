import textract from "textract";
import { formatFileSize } from "./size.convert";
import { countWordFrequency } from "./word.count";

/**
 * Reads text from:
 * - Image
 * - PDF
 * - TXT file
 * - DOCX file
 * - XLSX file
 * - PPTX file
 * - CSV file
 * - JSON file
 * - XML file
 * - HTML file
 */
class ReadFiles {
    static async readTextFromAll(files: Express.Multer.File[]): Promise<any> {
        try {
            const texts = await Promise.all(
                files.map(async (file) => {
                    const text = await new Promise<string>(
                        (resolve, reject) => {
                            textract.fromBufferWithMime(
                                file.mimetype,
                                file.buffer,
                                function (error, text) {
                                    if (error) {
                                        console.log(
                                            "Error in reading file: ",
                                            error
                                        );
                                        reject(error);
                                    }
                                    resolve(text);
                                }
                            );
                        }
                    );
                    return {
                        fileName: file.originalname,
                        text,
                        size: formatFileSize(file.size),
                        wordCount: countWordFrequency(text),
                    };
                })
            );
            return texts;
        } catch (err: any) {
            console.log(
                `Error in reading text from all files: ${err}`.trim() + "\n"
            );
            throw err;
        }
    }
}

export default ReadFiles;
