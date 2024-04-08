/**
 * @file FILEPATH: /Users/satyamanand/Downloads/Data/Satyam/Interview_Prep/FileSense/src/Controllers/FileAnalytics/file.controller.test.ts
 * @description This file contains the unit tests for the FileController class.
 * It tests the functionality of the uniqueWords, maskWords, and wordSynonyms methods.
 * The tests ensure that the methods handle requests and responses correctly,
 * and return the expected status codes and data.
 */
import { Request, Response } from "express";
import database from "../../Databases/mongoDB/connection";
import { uniqueWordsExpects } from "../../stores/tests/uniqueWords";
import { maskWordsExpects } from "../../stores/tests/maskWords";
import { FileActivityController } from "./file.controller";
import { E_HTTP_STATUS_CODE } from "../../stores/enums/HTTP_Status";
import { wordSynonymsExpects } from "../../stores/tests/wordSynonyms";

describe("FileController", () => {
    let fileController: FileActivityController;
    let consoleErrorSpy: jest.SpyInstance;
    let originalConsoleError: any;

    /**
     * Executes once before all test cases in the describe block.
     * It initializes the FileActivityController and establishes a connection to the database.
     */
    beforeAll(async () => {
        console.log(".... Starting Connection ....");
        fileController = new FileActivityController();
        await database.connect();
        console.log(".... Connection Established ....");
    });

    /**
     * Executes before each test case in the describe block.
     * It resets the console.error and console.log functions,
     * and sets up a spy on console.error to prevent error logs from interfering with the test results.
     */
    beforeEach(() => {
        console.error = jest.fn();
        console.log = jest.fn();

        originalConsoleError = console.error;
        consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation((message) => {
                if (!message.includes("Cannot log after tests are done")) {
                    originalConsoleError(message);
                }
            });
    });

    /**
     * Executes after each test case in the describe block.
     * It restores the original console.error function and clears the consoleErrorSpy.
     */
    afterEach(() => {
        consoleErrorSpy.mockRestore();
        console.error = originalConsoleError;
    });

    /**
     * Executes after all test cases in the describe block.
     * It closes the connection to the database and clears all mocks.
     */
    afterAll(async () => {
        try {
            console.log(".... Closing Connection ....");
            await database.closeConnection();
            console.log(".... Connection Closed ....");
        } catch (error) {
            console.error("Error closing connection:", error);
        }
        jest.clearAllMocks();
    });

    describe("uniqueWords", () => {
        test("should upload files and return 201 status: ", async () => {
            const req: Request = uniqueWordsExpects[0]
                .input as unknown as Request;
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await fileController.uniqueWords(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        test("should return text, and count of unique words analytics: ", async () => {
            const req: Request = uniqueWordsExpects[0]
                .input as unknown as Request;
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await fileController.uniqueWords(req, res);

            expect(res.send).toHaveBeenCalledWith(
                uniqueWordsExpects[0].expectedOutput
            );
        });
    });

    describe("maskWords", () => {
        test("should mask files and return 200 status: ", async () => {
            const req: Request = maskWordsExpects[0]
                .input as unknown as Request;
            /**
             * Represents the response object used in the file controller test.
             */
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await fileController.wordMasking(req, res);

            expect(res.status).toHaveBeenCalledWith(E_HTTP_STATUS_CODE.OK);
        });

        test("should mask text and send the url of stored file: ", async () => {
            const req: Request = maskWordsExpects[0]
                .input as unknown as Request;
            /**
             * Represents the response object used in the file.controller.test module.
             */
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await fileController.wordMasking(req, res);

            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.arrayContaining([expect.any(String)]),
                    message: maskWordsExpects[0].expectedOutput.message,
                    metaData: {
                        status: maskWordsExpects[0].expectedOutput.metaData
                            .status,
                        error: maskWordsExpects[0].expectedOutput.metaData
                            .error,
                    },
                })
            );
        });
    });

    describe("wordSynonyms", () => {
        test("should mask files and return 200 status: ", async () => {
            const req: Request = wordSynonymsExpects[0]
                .input as unknown as Request;
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await fileController.findSynonyms(req, res);

            expect(res.status).toHaveBeenCalledWith(E_HTTP_STATUS_CODE.OK);
        });

        test("should mask text and send the url of stored file: ", async () => {
            const req: Request = wordSynonymsExpects[0]
                .input as unknown as Request;
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;

            await fileController.findSynonyms(req, res);

            expect(res.send).toHaveBeenCalledWith(
                wordSynonymsExpects[0].expectedOutput
            );
        });
    });
});
