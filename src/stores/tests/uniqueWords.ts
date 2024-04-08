export const uniqueWordsExpects = [
    {
        expectedOutput: {
            data: [
                {
                    fileName: "file1.txt",
                    size: "20 bytes",
                    text: "Sample text for testing",
                    wordCount: {
                        sample: 1,
                        testing: 1,
                        text: 1,
                    },
                },
                {
                    fileName: "file2.txt",
                    size: "19 bytes",
                    text: "Another sample text",
                    wordCount: {
                        another: 1,
                        sample: 1,
                        text: 1,
                    },
                },
            ],
            message: "File uploaded successfully",
            metaData: {
                status: 201,
                error: false,
            },
        },
        input: {
            body: {
                email: "thesatemail@gmail.com",
            },
            files: [
                {
                    fieldname: "files",
                    originalname: "file1.txt",
                    encoding: "utf-8",
                    mimetype: "text/plain",
                    buffer: Buffer.from("Sample text for testing"),
                    size: 20,
                },
                {
                    fieldname: "files",
                    originalname: "file2.txt",
                    encoding: "utf-8",
                    mimetype: "text/plain",
                    buffer: Buffer.from("Another sample text"),
                    size: 19,
                },
            ],
        },
    },
];
