import express, { Request, Response } from "express";
import { E_HTTP_STATUS_CODE } from "../stores/enums/HTTP_Status";
import fileActivityController from "../Controllers/FileAnalytics/file.controller";

/**
 * Express router for handling routes.
 */
const defaultRoute = express.Router();
/**
 * GET request for the root route. This is where you can start your application.
 * @name /
 * @function
 * @memberof module:routes/root~routes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @property {string} req.method - The HTTP request method. Will be 'GET'.
 * @property {string} req.url - The URL of the request. Will be '/'.
 * @returns {undefined} Sends a response to the client.
 */
defaultRoute.get("/", (req: Request, res: Response) => {
    res.status(E_HTTP_STATUS_CODE.OK).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Night and Light Switch</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
                body.light-mode {
                    background-color: #f8f8f8;
                    color: #333;
                }

                body.dark-mode {
                    background-color: #111;
                    color: #fff;
                }

                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

                    h2 {
                        a {
                            color: #007bff;
                        }
                    }
                }

                .container.light-mode {
                    background-color: #fff;
                }

                .container.dark-mode {
                    background-color: #111;
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
                }

                h1 {
                    color: #007bff;
                }

                hr {
                    border: 0;
                    border-top: 1px solid #ddd;
                    margin: 20px 0;
                }

                b {
                    color: #555;
                }

                /* Positioning the toggle switch */
                .toggle-switch {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    cursor: pointer;
                }
            </style>
        </head>
        <body class="dark-mode">
            <!-- Toggle switch -->
            <div class="toggle-switch" id="toggleSwitch">
                <i class="lightbulb fas fa-lightbulb"></i>
            </div>

            <div class="container dark-mode">
                <h1>Welcome to the server of File-Sense!</h1>
                <h2>By Master <a href="https://www.satyamanand.in" target="_blank">Satyam Anand</a></h2>
                <p>This server is running on port <strong>${process.env.PORT}</strong></p>
                <hr>
                <h2>Request Information</h2>
                <p><b>Method:</b> ${req.method}</p>
                <p><b>Original URL:</b> ${req.originalUrl}</p>
                <p><b>Base URL:</b> ${req.baseUrl}</p>
                <p><b>URL:</b> ${req.url}</p>
                <p><b>Path:</b> ${req.path}</p>
                <p><b>Protocol:</b> ${req.protocol}</p>
                <p><b>Hostname:</b> ${req.hostname}</p>
                <p><b>IP:</b> ${req.ip}</p>
            </div>
            
            <script>
                const toggleSwitch = document.getElementById('toggleSwitch');
                const body = document.body;
                const container = document.querySelector('.container');

                toggleSwitch.addEventListener('click', () => {
                    if (body.classList.contains('light-mode')) {
                        body.classList.remove('light-mode');
                        body.classList.add('dark-mode');
                        container.classList.remove('light-mode');
                        container.classList.add('dark-mode');
                        toggleSwitch.innerHTML = '<i class="lightbulb far fa-lightbulb"></i>';
                    } else {
                        body.classList.remove('dark-mode');
                        body.classList.add('light-mode');
                        container.classList.remove('dark-mode');
                        container.classList.add('light-mode');
                        toggleSwitch.innerHTML = '<i class="lightbulb fas fa-lightbulb"></i>';
                    }
                });
            </script>
        </body>
        </html>
    `);
});

export default defaultRoute;
