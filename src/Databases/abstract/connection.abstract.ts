import mongoose from "mongoose"; // Imports the mongoose library.

/**
 * Represents a database connection.
 */
export interface IDB_Connection {
    /**
     * Connects to the database.
     * @returns A promise that resolves when the connection is established.
     */
    connect(): Promise<void>;

    /**
     * Closes the database connection.
     * @returns A promise that resolves when the connection is closed.
     */
    closeConnection(): Promise<void>;

    /**
     * Drops the entire database.
     * @returns A promise that resolves when the database is dropped.
     */
    dropDatabase(): Promise<void>;

    /**
     * Removes a model from the database.
     * @param modelName - The name of the model to remove.
     * @returns A promise that resolves when the model is removed.
     */
    removeModel(modelName: string): Promise<void>;
}

/**
 * Represents an abstract class for a database connection.
 */
export abstract class DB_Connection implements IDB_Connection {
    /**
     * Connects to the database.
     * @returns A promise that resolves when the connection is established.
     */
    public abstract connect(): Promise<void>;

    /**
     * Checks the current connection status.
     * @returns A promise that resolves with the current connection status.
     */
    protected abstract checkConnection(): Promise<typeof mongoose | undefined>;

    /**
     * Creates a new database connection.
     * @returns A promise that resolves when the connection is created.
     */
    protected abstract createConnection(): Promise<void>;

    /**
     * Closes the database connection.
     * @returns A promise that resolves when the connection is closed.
     */
    public abstract closeConnection(): Promise<void>;

    /**
     * Drops the entire database.
     * @returns A promise that resolves when the database is dropped.
     */
    public abstract dropDatabase(): Promise<void>;

    /**
     * Removes a specific model from the database.
     * @param modelName - The name of the model to remove.
     * @returns A promise that resolves when the model is removed.
     */
    public abstract removeModel(modelName: string): Promise<void>;
}
