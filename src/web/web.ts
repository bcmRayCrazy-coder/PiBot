import express from "express";
import { env } from "../env.js";
export function initWeb() {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("PiBot");
    });

    const port = env.web.port;
    app.listen(port, () => {
        console.log(`Web listening on port ${port}`);
    });

    return app;
}
