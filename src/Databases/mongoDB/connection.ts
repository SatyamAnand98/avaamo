import mongoose, { Connection, Mongoose } from "mongoose"; // Importing mongoose, Connection and Mongoose
import { IDB_Connection } from "../abstract/connection.abstract"; // Importing IDB_Connection from connection.abstract

/**
 * Represents a MongoDB database connection.
 */
export class DatabaseConnection implements IDB_Connection {
    private static instance: DatabaseConnection;
    private mongooseInstance: Mongoose = mongoose;
    private connection: Connection | undefined;

    private constructor() {}

    /**
     * Returns the singleton instance of MongoDB_Database.
     * @returns The MongoDB_Database instance.
     */
    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    /**
     * Connects to the MongoDB database.
     * @returns A Promise that resolves when the connection is established.
     */
    public async connect(): Promise<void> {
        if (!this.connection) {
            await this.createConnection();
        }
    }

    /**
     * Closes the MongoDB database connection.
     * @returns A Promise that resolves when the connection is closed.
     */
    public async closeConnection(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
        }
    }

    /**
     * Drops the current MongoDB database.
     * @returns A Promise that resolves when the database is dropped.
     */
    public async dropDatabase(): Promise<void> {
        if (this.connection) {
            await this.connection.dropDatabase();
        }
    }

    /**
     * Removes a model from the MongoDB database.
     * @param modelName - The name of the model to remove.
     * @returns A Promise that resolves when the model is removed.
     */
    public async removeModel(modelName: string): Promise<void> {
        if (this.connection && this.connection.models[modelName]) {
            this.connection.deleteModel(modelName);
        }
    }

    /**
     * Establishes a connection to the MongoDB database.
     * @returns A Promise that resolves when the connection is established.
     * @throws {Error} If the database URL is not provided.
     */
    private async createConnection(): Promise<void> {
        const DB_URL: string =
            process.env.ENVIRONMENT === "LOCAL"
                ? process.env.DB_LOCAL || ""
                : process.env.ENVIRONMENT == "DEV"
                ? process.env.DB_DEV || ""
                : process.env.DB_PROD || ""; // Database URL based on the environment

        const DB_USER: string =
            process.env.ENVIRONMENT === "LOCAL"
                ? process.env.DB_LOCAL_USER || ""
                : process.env.ENVIRONMENT == "DEV"
                ? process.env.DB_DEV_USER || ""
                : process.env.DB_PROD_USER || ""; // Database username based on the environment

        const DB_PASS: string =
            process.env.ENVIRONMENT === "LOCAL"
                ? process.env.DB_LOCAL_PASS || ""
                : process.env.ENVIRONMENT == "DEV"
                ? process.env.DB_DEV_PASS || ""
                : process.env.DB_PROD_PASS || ""; // Database password based on the environment

        if (!DB_URL) {
            throw new Error("Database URL is not provided.");
        }

        this.connection = this.mongooseInstance.connection; // Get the default connection object from mongoose instance

        // Check if the connection is already established
        if (this.connection.readyState === 1) {
            console.log("Mongoose connection already established.");
            return;
        }

        // Otherwise, establish the connection
        await this.mongooseInstance.connect(DB_URL, {
            dbName: "avaamo",
            user: DB_USER,
            pass: DB_PASS,
        });

        // Handle successful connection
        this.connection.on("connected", () => {
            console.log("🟢 Mongoose has connected successfully.");
        });
        // Handle reconnection
        this.connection.on("reconnected", () => {
            console.log("✅ Mongoose has reconnected successfully.");
        });

        // Handle connection errors
        this.connection.on("error", (error) => {
            console.log("🔴 Mongoose connection has an error", error);
            this.mongooseInstance.disconnect();
        });
    }
}

const database = DatabaseConnection;
export default database;
