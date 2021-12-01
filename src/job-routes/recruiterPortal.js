const express = require('express')
const router = require("express").Router();
const { MongoClient, ObjectId } = require("mongodb");
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

// view candidates applied for particular job
router.get('/candidates-applied/:id', isRecruiter, async (req, res) => {
    try {
        let id = req.params.id
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let data = await db.collection("jobs").findOne({ _id : ObjectId(id) });
        let candidatesApplied = data.candidatesApplied
        if (candidatesApplied) {
            res.status(200).json(candidatesApplied);
        } else {
            res.status(400).json({ message: "No Applications Received" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

//view particular job

router.get('/updatejob/:id', isRecruiter, async (req, res) => {
    try {
        let id = req.params.id
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let job = await db.collection("jobs").findOne({_id : ObjectId(id)})
        if (job) {
            res.status(200).json(job);
        } else {
            res.status(404).json({ message: "No Data Found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }

})

// update particular job
router.put('/updatejob/:id', isRecruiter, async (req, res) => {
    try {
        let id = req.params.id
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let update = await db.collection("jobs").updateOne({_id : ObjectId(id)},{ $set: { jobId : req.body.jobId, description : req.body.description , skills : req.body.skills , updatedDate : new Date().toLocaleDateString()}}, { upsert : true });
        if (update) {
            res.status(200).json(update);
        } else {
            res.status(404).json({ message: "No Data Found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

//delete particular job
router.delete('/deletejob/:id', isRecruiter, async (req, res) => {
    try {
        let id = req.params.id
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        await db.collection("jobs").deleteOne({_id : ObjectId(id)});
        res.status(200).json({ message: "Successfully Deleted" })
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})



module.exports = router;
