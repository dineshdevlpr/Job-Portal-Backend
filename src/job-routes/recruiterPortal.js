const express = require('express')
const router = require("express").Router();
const { MongoClient, ObjectID } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const isRecruiter = require("../middleware-authorization/isRecruiter");


const dbUrl = process.env.DB_URL;
const app = express()
app.use(cors({
    origin : "*",
    credentials : true
}));

// create jobs

router.post('/createjob', isRecruiter, async (req, res) => {

    try {
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let jobId = await db.collection("jobs").findOne({ jobId : req.body.jobId })
        if (!jobId) {
            let data = await db.collection("jobs").insertOne({ jobId : req.body.jobId, description : req.body.description , skills : req.body.skills , date : new Date().toLocaleDateString()});
            res.status("200").json({ message: "Job Created successfully" })
        } else {
            res.status("401").json({ message: "Job ID Already Exists" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

// list of jobs created

router.get('/listjobs', isRecruiter, async (req, res) => {
    try {
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let data = await db.collection("jobs").find().toArray();
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "No Data Found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }

})

router.get('/candidates-applied', isRecruiter, async (req, res) => {
    try {
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let data = await db.collection("candidate").find(appliedJobs.length>0).toArray();
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "No Data Found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})



module.exports = router;
