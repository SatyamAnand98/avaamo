import fs from "fs";
import path from "path";

export function saveBufferToS3(responseArray: Express.Multer.File[]) {
    const filePaths: string[] = [];
    const filesData = responseArray;
    filesData.forEach((fileData: Express.Multer.File) => {
        const originalName = fileData.originalname;
        const buffer = fileData.buffer;

        const directory = path.join(__dirname, "../../../AWS_S3/");
        fs.mkdirSync(directory, { recursive: true });

        const filePath = path.join(
            directory,
            `${originalName.split(".")[0]}-${Date.now()}-masked-${
                originalName.split(".")[1]
            }`
        );
        filePaths.push(filePath);
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
        });
    });

    return filePaths;
}
