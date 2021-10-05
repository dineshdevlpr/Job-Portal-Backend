const express = require('express')
const router = require("express").Router();
const { MongoClient, ObjectID } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const isCandidate = require("../middleware-authorization/isCandidate");


const dbUrl = process.env.DB_URL;
const app = express()
app.use(cors({
    origin : "*",
    credentials : true
}));


// list of jobs created

router.get('/listjobs', isCandidate, async (req, res) => {
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

router.put('/apply/:jobId/:email', isCandidate, async (req, res) => {
    try {
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let job = await db.collection("jobs").find({jobId:red.params.jobId});
        let updateAppliedJob = await db.collection("candidate").updateOne({email : req.params.email},{ $push :{ appliedJobs : job}});
        if (updateAppliedJob) {
            res.status(200).json(updateAppliedJob);
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
