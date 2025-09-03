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
        });
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in /Partial/Save:", error);
        res.status(500).json({ message: error.message });
    }
});



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



module.exports = route;
