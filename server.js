const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()

const authRoutes = require("./routes/auth")
const employeeRoutes = require("./routes/employee")
const attendanceRoutes = require("./routes/attendance")
const candidateRoutes = require('./routes/candidateapplication');
const interviewRoutes = require('./routes/interview');
const jobPostingRoutes = require('./routes/jobposting')
const goalRoutes = require('./routes/goal');
const leaveRequestRoutes = require('./routes/leaverequest');
const performanceRoutes = require('./routes/performance');
const metricsRoutes = require('./routes/metrics');

//middleware
app.use(cors())
app.use(bodyParser.json())

//routes
app.use("/apiAuth", authRoutes)
app.use("/apiEmployees", employeeRoutes)
app.use("/apiAttendance", attendanceRoutes)
app.use('/apiCandidates', candidateRoutes);
app.use('/apiInterviews', interviewRoutes);
app.use('/apiJobPosting', jobPostingRoutes);
app.use('/apiGoals', goalRoutes);
app.use('/apiLeaveRequest', leaveRequestRoutes);
app.use('/apiPerformances', performanceRoutes);
app.use('/metrics', metricsRoutes);

//mongoose connect
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MONGODB Connected Successfully")
    app.listen(process.env.PORT, () => {
        console.log(`Server running on the port ${process.env.PORT}`)
    })
})
    .catch((err) => {
        console.log("error ocurred", err.message)
    })