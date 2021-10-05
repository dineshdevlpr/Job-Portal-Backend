const express = require('express')
const cors = require("cors");
require("dotenv").config();

// auth routes
const authRecruiter = require("./src/auth-routes/authRecruiter");
const authCandidate = require("./src/auth-routes/authCandidate")

// authentication middleware
// const isRecruiter = require("./src/middleware/isRecruiter");
// const isCandidate = require("./src/middleware/isCandidate")

// job portal routes
const recruiterPortal = require("./src/job-routes/recruiterPortal")
const candidatePortal = require("./src/job-routes/candidatePortal")

const app = express()

const port = process.env.PORT || 4000;
const dbUrl = process.env.DB_URL;

app.use(express.json())
app.use(cors({
    origin : "*",
    credentials : true
}));
app.use("/recruiter", authRecruiter)
app.use("/candidate", authCandidate)
app.use("/recruiter-portal", recruiterPortal)
app.use("/candidate-portal", candidatePortal)




app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`)
})
