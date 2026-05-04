import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: "included" }));

app.use(express.json({ limit: "1kb" }));

export default app;
