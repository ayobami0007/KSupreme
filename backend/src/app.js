require("dotenv").config();
const db = require("./config/db")

const express = require("express");
const cors = require("cors")
const app = express();
const sessionRoutes = require("./routes/sessions");
const termRoutes = require("./routes/terms");
const classRoutes = require("./routes/classes")
const studentRoutes = require("./routes/students")
const schoolFeeRoutes = require("./routes/schoolFees")
const paymentRoutes = require("./routes/payments")
const paymentsDashboardRoutes = require("./routes/paymentsDashboard");
const bursarRoutes = require("./routes/bursar");
const reportRoutes = require("./routes/reports") 
const dashboardRoutes = require("./routes/dashboard");

app.use(cors());
app.use(express.json());


app.use("/api/bursar", bursarRoutes)
app.use("/api/sessions", sessionRoutes);
app.use("/api/terms", termRoutes);
app.use("/api/classes", classRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/school-fees", schoolFeeRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/payments/dashboard", paymentsDashboardRoutes);
app.use("/api/reports", reportRoutes )
app.use("/api/dashboard", dashboardRoutes)
app.get("/", (req,res) =>{
    res.send("Payment Portal API running")
}
);


app.get("/db-test", async (req, res) =>{
    try{
   await db.query("SELECT 1");
   res.json({message:"databasee connecter"})

    } catch(error){
        res.status(500).json({ error:error.message  })
    }
   
} )


module.exports = app;