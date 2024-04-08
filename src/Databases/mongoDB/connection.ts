import mongoose, { Connection, Mongoose } from "mongoose";
import { IDB_Connection } from "../abstract/connection.abstract";
import { createDBModels } from "./models";

export class DatabaseConnection implements IDB_Connection {
    private static instance: DatabaseConnection;
    private mongooseInstance: Mongoose = mongoose;
    private connection: Connection | undefined;
    private models: { [key: string]: any } = {};
    private databaseConn: mongoose.Connection | undefined;

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        if (!this.connection) {
            await this.initConnection();
        }
    }

    public async closeConnection(): Promise<void> {
        if (this.databaseConn) {
            await this.databaseConn.close();
        }
    }

    public async dropDatabase(): Promise<void> {
        if (this.connection) {
            await this.connection.dropDatabase();
        }
    }

    public async removeModel(modelName: string): Promise<void> {
        if (this.connection && this.connection.models[modelName]) {
            this.connection.deleteModel(modelName);
        }
    }

    private async initConnection(): Promise<void> {
        const DB_URL: string =
            process.env.ENVIRONMENT === "LOCAL"
                ? process.env.DB_LOCAL || ""
                : process.env.ENVIRONMENT == "DEV"
                ? process.env.DB_DEV || ""
                : process.env.DB_PROD || "";

        const DB_USER: string =
            process.env.ENVIRONMENT === "LOCAL"
                ? process.env.DB_LOCAL_USER || ""
                : process.env.ENVIRONMENT == "DEV"
                ? process.env.DB_DEV_USER || ""
                : process.env.DB_PROD_USER || "";

        const DB_PASS: string =
            process.env.ENVIRONMENT === "LOCAL"
                ? process.env.DB_LOCAL_PASS || ""
                : process.env.ENVIRONMENT == "DEV"
                ? process.env.DB_DEV_PASS || ""
                : process.env.DB_PROD_PASS || "";

        if (!DB_URL) {
            throw new Error("Database URL is not provided.");
        }

        this.connection = this.mongooseInstance.connection;

        if (this.connection.readyState === 1) {
            console.log("✅ Mongoose connection already established.");
            return;
        }

        this.databaseConn = this.mongooseInstance.createConnection(DB_URL, {
            dbName: "avaamo",
            user: DB_USER,
            pass: DB_PASS,
        });

        await new Promise<void>((resolve, reject) => {
            this.databaseConn?.once("open", () => {
                console.log("🟢 Mongoose has connected successfully.");
                this.models = createDBModels(this.databaseConn!);
                resolve();
            });

            this.databaseConn?.on("error", (error) => {
                console.error("🔴 Mongoose connection has an error", error);
                reject(error);
            });
        });
    }

    public getModels(): { [key: string]: any } {
        return this.models;
    }
}

const database = DatabaseConnection.getInstance();
export default database;
