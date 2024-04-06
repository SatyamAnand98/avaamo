/**
 * Represents a helper interface for file and word analytics.
 */
interface IHelper {
    /**
     * Uploads a file and performs file activity analysis.
     * @param fileActivity - The file activity data.
     * @returns A promise that resolves with the result of the file upload and analysis.
     */
    uniqueWords(files: Express.Multer.File[], email: string): Promise<any>;

    /**
     * Performs file analytics.
     * @returns A promise that resolves with the result of the file analytics.
     */
    findSynonyms(
        words: string[],
        files: Express.Multer.File[],
        email: string
    ): Promise<any>;

    /**
     * Performs word masking.
     * @returns A promise that resolves with the result of the word masking.
     */
    wordMasking(
        words: string[],
        files: Express.Multer.File[],
        email: string
    ): Promise<any>;
}

/**
 * Abstract class representing a helper.
 * @abstract
 * @class HelperAbstract
 * @implements {IHelper}
 */
abstract class HelperAbstract implements IHelper {
    abstract uniqueWords(
        files: Express.Multer.File[],
        email: string
    ): Promise<any>;
    abstract findSynonyms(
        words: string[],
        files: Express.Multer.File[],
        email: string
    ): Promise<any>;
    abstract wordMasking(
        words: string[],
        files: Express.Multer.File[],
        email: string
    ): Promise<any>;
}

export { IHelper, HelperAbstract };
