import express from "express"; // Express.js framework.
import cors from "cors"; // CORS middleware.
import dotenv from "dotenv"; // Environment variable loader.
import database, { DatabaseConnection } from "./Databases/mongoDB/connection"; // Database connection.
import routes from "./Routes"; // Routes for the server.
import defaultRoute from "./Routes/default.route";

dotenv.config();

/**
 * Represents a server that handles incoming requests and manages a database connection.
 */
class Server {
    private app: express.Application; // Express application.
    private databaseInstance: DatabaseConnection | undefined; // Database connection instance.

    /**
     * Represents the Server class.
     */
    constructor() {
        this.app = express();
        this.middleware();
        this.handleSIGINT();
        this.connectDB();
        this.routes();
    }

    /**
     * Sets up the middleware for the server.
     */
    private middleware() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    /**
     * Connects to the database.
     */
    private connectDB() {
        this.databaseInstance = database.getInstance();
        this.databaseInstance.connect();
    }

    /**
     * Sets up the routes for the server.
     */
    private routes() {
        this.app.use(defaultRoute);
        this.app.use("/api/v1", routes);
    }

    /**
     * Starts the server and listens for incoming requests on the specified port.
     */
    public start() {
        try {
            if (!process.env.PORT) throw new Error("Port is not defined");
            this.app.listen(process.env.PORT, () => {
                console.log(`🟢 Server is running on port ${process.env.PORT}`);
            });
        } catch (error: any) {
            console.log("Error in start server: ", error.message);
            this.handleUncaughtError();
        }
    }

    /**
     * Handles the SIGINT signal and shuts down the server gracefully.
     */
    private handleSIGINT() {
        process.on("SIGINT", () => {
            console.error("SIGINT received, shutting down...");
            if (this.databaseInstance) this.databaseInstance.closeConnection();
            process.exit(0);
        });
    }

    /**
     * Handles uncaught errors by logging the error, closing the database connection (if available),
     * and exiting the process with a non-zero exit code.
     */
    private handleUncaughtError() {
        process.on("uncaughtException", (error) => {
            console.error("There was an uncaught error", error);
            if (this.databaseInstance) this.databaseInstance.closeConnection();
            process.exit(1);
        });
    }
}

const server = new Server();
server.start();
