require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { fail } = require("./utils/apiResponse");

const app = express();

connectDB();

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);
app.use(cors());
app.use(express.json({ limit: "100kb" }));

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/billing", require("./routes/billingRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/triage", require("./routes/triageRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use("/api", (req, res) => fail(res, "Endpoint not found", null, 404));

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not set — authentication will fail until it is configured.");
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
