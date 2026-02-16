import express from "express";
import { config } from "../config.js";
export function initWeb() {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("PiBot");
    });

    const port = config.web.port;
    app.listen(port, () => {
        console.log(`Web listening on port ${port}`);
    });

    return app;
}
