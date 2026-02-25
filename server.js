import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4173;

app.use(compression());
app.use(express.static(__dirname, {
    extensions: ["html"],
    maxAge: "1h"
}));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Hearth & Home running at http://localhost:${PORT}`);
});
