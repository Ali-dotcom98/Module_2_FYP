const express = require("express");
const { Protect } = require("../Middleware/TokenMiddleware");
const PartialSubmission = require("../Models/PartialSubmission_Model");
const PartialSubmission_Model = require("../Models/PartialSubmission_Model");
const route = express.Router();

route.post("/Create", Protect, async (req, res) => {
    try {
        const { AssingmentId, Questions, userGroup } = req.body;


        const existing = await PartialSubmission.findOne({
            assignmentId: AssingmentId,
            "Students._id": req.user._id,
            feedback: "",
            SubmissionVote: null,

        });

        if (existing) {
            return res.status(200).json(existing);
        }

        const submission = await PartialSubmission.create({
            assignmentId: AssingmentId,
            Questions: Questions,
            Students: [...userGroup],
        });

        res.status(201).json(submission);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

route.get("/Save/:id", Protect, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PartialSubmission_Model.findOne({
            assignmentId: id,
            Students: { $elemMatch: { _id: req.user._id } }
        }).populate("Questions.lockedby");
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in /Partial/Save:", error);
        res.status(500).json({ message: error.message });
    }
});


route.put("/Update/:id", Protect, async (req, res) => {
    try {
        const Data = req.body;
        const result = await PartialSubmission_Model.find({
            assignmentId: req.params.id,
            _id: Data._id
        })
        console.log(result);

        res.send(result)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})



route.get("/Info", Protect, async (req, res) => {
    try {
        const { assignmentId } = req.body;

        const result = await PartialSubmission_Model.find({
            assignmentId: assignmentId,
        });

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No submission found" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


route.get("/SubmitAssingments", async (req, res) => {
    try {
        const result = await PartialSubmission_Model.find({ status: "submitted" }).populate("assignmentId");
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No submission found" });
        }

        const JustAssingments = result.map((item) => item.assignmentId)
        res.status(200).json(JustAssingments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

route.get("/SubmitAssingment/:id", async (req, res) => {
    try {
        const result = await PartialSubmission_Model.find({ assignmentId: req.params.id });
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No submission found" });
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



module.exports = route;
