// require("dotenv").config();
// const db = require("./config/db")

// const express = require("express");
// const cors = require("cors")
// const app = express();
// const sessionRoutes = require("./routes/sessions");
// const termRoutes = require("./routes/terms");
// const classRoutes = require("./routes/classes")
// const studentRoutes = require("./routes/students")
// const schoolFeeRoutes = require("./routes/schoolFees")
// const paymentRoutes = require("./routes/payments")
// const paymentsDashboardRoutes = require("./routes/paymentsDashboard");
// const bursarRoutes = require("./routes/bursar");
// const reportRoutes = require("./routes/reports")
// const dashboardRoutes = require("./routes/dashboard");

// app.use(cors());
// app.use(express.json());


// app.use("/api/bursar", bursarRoutes)
// app.use("/api/sessions", sessionRoutes);
// app.use("/api/terms", termRoutes);
// app.use("/api/classes", classRoutes)
// app.use("/api/students", studentRoutes)
// app.use("/api/school-fees", schoolFeeRoutes)
// app.use("/api/payments", paymentRoutes)
// app.use("/api/payments/dashboard", paymentsDashboardRoutes);
// app.use("/api/reports", reportRoutes)
// app.use("/api/dashboard", dashboardRoutes)
// app.get("/", (req, res) => {
//     res.send("Payment Portal API running")
// }
// );


// app.get("/db-test", async (req, res) => {
//     try {
//         const result = await db.query("SELECT NOW ()")
//         res.json({
//             message: "Database Connected",
//             time: result.rows[0]
//         })

//     } catch (error) {
//         console.error("DB TEST ERROR:", error);
//   res.status(500).json({
//     message: "Database connection failed",
//     error: error.message,
//   });
//     }

// })


// module.exports = app;


require("dotenv").config();
const db = require("./config/db");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

// Route imports
const sessionRoutes = require("./routes/sessions");
const termRoutes = require("./routes/terms");
const classRoutes = require("./routes/classes");
const studentRoutes = require("./routes/students");
const schoolFeeRoutes = require("./routes/schoolFees");
const paymentRoutes = require("./routes/payments");
const paymentsDashboardRoutes = require("./routes/paymentsDashboard");
const bursarRoutes = require("./routes/bursar");
const reportRoutes = require("./routes/reports");
const dashboardRoutes = require("./routes/dashboard");

app.use(helmet());

const corsOptions = {
  origin: ["https://k-supreme.vercel.app"], 
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
};
app.use(cors(corsOptions));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests, please try again later."
}));

app.use(express.json());

// Routes
app.use("/api/bursar", bursarRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/terms", termRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/school-fees", schoolFeeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payments/dashboard", paymentsDashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

//  Health check
app.get("/", (req, res) => {
  res.send("Payment Portal API running");
});

//  DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database Connected",
      time: result.rows[0]
    });
  } catch (error) {
    console.error("DB TEST ERROR:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

//  Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;

