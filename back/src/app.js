import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import plansRoutes from "./routes/plans.routes.js";
import periodsRoutes from "./routes/periods.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", coursesRoutes);
app.use("/api", plansRoutes);
app.use("/api", periodsRoutes);

export default app;
