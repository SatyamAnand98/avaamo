import express from "express";
import fileActivityController from "../Controllers/FileAnalytics/file.controller";
import multer from "multer";

const fileActivityRoutes = express.Router();

const upload = multer(); // add `{ dest: "uploads/" }` to store the files

fileActivityRoutes.post(
    "/get/unique-words",
    upload.array("files"),
    fileActivityController.uniqueWords
);

fileActivityRoutes.post(
    "/get/synonyms",
    upload.array("files"),
    fileActivityController.findSynonyms
);
fileActivityRoutes.post(
    "/mask-words",
    upload.array("files"),
    fileActivityController.wordMasking
);

export default fileActivityRoutes;
