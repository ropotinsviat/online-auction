import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error-middleware.js";
import express from "express";
import router from "./routers/index.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(cookieParser());

app.use(router);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
