const express = require('express')
const router = require("express").Router();
const { MongoClient, ObjectId } = require("mongodb");
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

//apply to jobs
router.put('/apply/:useremail/:id/:jobid/:description/:skills', isCandidate, async (req, res) => {
    try {
        let userEmail = req.params.useremail
        let id = req.params.id
        let appliedJobId = req.params.jobid
        let appliedJobDescription = req.params.description
        let appliedJobSkills = req.params.skills
        let appliedDate = new Date().toLocaleDateString()
        let client = await MongoClient.connect(dbUrl);
        let db = await client.db("Job-Portal");

        //check if already applied
        let isAlreadyApplied = await db.collection("jobs").findOne({ _id : ObjectId(id) , candidatesApplied :{email :userEmail} })
        console.log(":::ALREADY APPLIED " +isAlreadyApplied)

        //if not already applied then proceed to apply
        if(!isAlreadyApplied){
            // update applied candidate details in jobs collection
            let updateCandidateApplied = await db.collection("jobs").updateOne({_id : ObjectId(id)},{ $push :{ candidatesApplied : {email : userEmail}}}, { upsert: true });
            console.log(updateCandidateApplied)

            //update applied job details in candidate collection
            let jobApplied = await db.collection("candidate").updateOne({email :userEmail},{ $push :{ appliedJobs : {appliedJobId ,appliedJobDescription, appliedJobSkills, appliedDate}}}, { upsert: true } )
            console.log(jobApplied)
            client.close();
            res.status(200).json({
            message: "Successfully Applied",
            });
        }else{
            res.status(400).json({
                message: `User With ${userEmail} already applied for this job`,
              });
        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

// view applied jobs
router.get('/appliedjobs/:useremail', isCandidate, async (req, res) => {
    try {
        let userEmail = req.params.useremail
        let client = await MongoClient.connect(dbUrl);
        let db = client.db("Job-Portal");
        let appliedJobLists = await db.collection("jobs").find({ candidatesApplied :{email :userEmail} }).toArray()
        if (appliedJobLists) {
            res.status(200).json(appliedJobLists)
        } else {
            res.status(400).json({ message: "No Jobs Applied" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500)
    }

})



module.exports = router;
