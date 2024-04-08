export const maskWordsExpects = [
    {
        expectedOutput: {
            data: [
                "/Users/satyamanand/Downloads/Data/Satyam/Interview_Prep/FileSense/AWS_S3/temp-1712501178118-masked.txt",
            ],
            message: "Word masking operation completed successfully",
            metaData: {
                status: 200,
                error: false,
            },
        },
        input: {
            body: {
                email: "thesatemail@gmail.com",
                words: "Sample, testing",
            },
            file: {
                fieldname: "files",
                originalname: "file1.txt",
                encoding: "utf-8",
                mimetype: "text/plain",
                buffer: Buffer.from("Sample text for testing"),
                size: 20,
            },
        },
    },
];

export interface IMaskWordExpectedOutput {
    data: string[];
    message: string;
    metaData: {
        status: number;
        error: boolean;
    };
}
