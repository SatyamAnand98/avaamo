/**
 * Express router for handling routes.
 * @remarks
 * This router is responsible for defining and handling all the routes in the application.
 * It includes the default route and the file activity routes.
 * @returns {Router} The express router instance.
 */
import express from "express";
import defaultRoute from "./default.route";
import fileActivityRoutes from "./fileActivity.routes";

/**
 * Express router for handling routes.
 */
const routes = express.Router();

routes.use(defaultRoute);
routes.use("/files", fileActivityRoutes);

// Export the routes for use in the server.
export default routes;
