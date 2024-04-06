import joi from "joi";

const fileSchema = joi.object<Express.Multer.File>({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    buffer: joi.binary().required(),
    size: joi.number().required(),
});

export const uniqueWordSchemaValidator = joi.object({
    email: joi.string().email().required(),
    files: joi.array().items(fileSchema).min(1).required(),
});

export const wordSchemaValidator = joi.object({
    email: joi.string().email().required(),
    words: joi.array().items(joi.string()).min(1).required(),
    files: joi.array().items(fileSchema).min(1).required(),
});
