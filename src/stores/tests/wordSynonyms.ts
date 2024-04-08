export const wordSynonymsExpects = [
    {
        expectedOutput: {
            data: [
                {
                    "file1.txt": {
                        synonyms: [
                            "test",
                            "taste",
                            "specimen",
                            "prototype",
                            "exemplar",
                            "template",
                            "instance",
                            "case",
                            "illustration",
                            "representative",
                            "exemplification",
                            "probe",
                            "reference",
                            "sample capture",
                        ],
                        word: "Sample",
                        wordCount: 1,
                    },
                },
                {
                    "file1.txt": {
                        synonyms: [
                            "assays",
                            "control",
                            "inspection",
                            "analysis",
                            "research",
                            "validation",
                            "verification",
                            "checking",
                        ],
                        word: "testing",
                        wordCount: 1,
                    },
                },
            ],
            message: "File analytics generated successfully",
            metaData: {
                error: false,
                status: 200,
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
