import joi from "joi";

/**
 * Schema for validating file properties.
 */
const fileSchema = joi.object<Express.Multer.File>({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    buffer: joi.binary().required(),
    size: joi.number().required(),
});

/**
 * Validates the unique word schema.
 * @remarks
 * This schema is used to validate an object that contains an email and an array of files.
 * The email field is required and must be a valid email address.
 * The files field is required and must be an array of files, where each file follows the fileSchema.
 * @example
 * const result = uniqueWordSchemaValidator.validate({
 *   email: 'example@example.com',
 *   files: [
 *     { name: 'file1.txt', size: 100 },
 *     { name: 'file2.txt', size: 200 }
 *   ]
 * });
 * if (result.error) {
 *   // Handle validation error
 * } else {
 *   // Validation successful
 * }
 */
export const uniqueWordSchemaValidator = joi.object({
    email: joi.string().email().required(),
    files: joi.array().items(fileSchema).min(1).required(),
});

/**
 * Validates the word schema.
 * @remarks
 * This function validates the word schema, which includes the email, words, and file properties.
 * @returns A Joi object representing the word schema validator.
 */
export const wordSchemaValidator = joi.object({
    /**
     * The email property.
     * @remarks
     * This property represents the email address and is required.
     */
    email: joi.string().email().optional(),

    /**
     * The words property.
     * @remarks
     * This property represents an array of words and is required.
     * Each word in the array must be a string.
     * The array must have a minimum length of 1.
     */
    words: joi.array().items(joi.string()).min(1).required(),

    /**
     * The file property.
     * @remarks
     * This property represents a file and is required.
     * It must adhere to the fileSchema.
     */
    file: fileSchema.required(),
});
