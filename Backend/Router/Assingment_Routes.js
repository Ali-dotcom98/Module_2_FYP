const express = require("express");
const { Protect } = require("../Middleware/TokenMiddleware");
const Assingment_Model = require("../Models/Assingment_Model");
const User_Model = require("../Models/User_Model");
const PartialSubmission_Model = require("../Models/PartialSubmission_Model");
const route = express.Router();

route.post("/Create", Protect, async (req, res) => {
    try {
        const { title } = req.body
        const DefaultAssingment = {
            description: "",
            dueDate: "",
            totalMarks: 0,
            questions: [
                {
                    questionText: "",
                    options: [""],
                    marks: "",
                    answer: ""
                }
            ],
            sections: [
                {
                    title: "",
                    description: "",
                    questions: [
                        {
                            questionText: "",
                            options: [""],
                            marks: ""
                        }
                    ]
                }
            ],
            settings: {
                groupSettings: {
                    numberOfGroups: 0,
                    studentsPerGroup: 0,
                },
                allowLateSubmission: false,
            },
        }

        const Assinment = await Assingment_Model.create({
            title: title,
            Instructor: req.user._id,
            ...DefaultAssingment
        })
        res.send(Assinment)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

route.put("/Update/:id", Protect, async (req, res) => {
    try {
        const status = req.user.status;
        if (status == "Student")
            return res.status(401).json({ message: "Student are Not Allowed" })

        const id = req.params.id;

        const Assingment = await Assingment_Model.findOne({ _id: id });
        if (!Assingment)
            return res.send("The challenge ID you are looking for does not exist.")

        Object.assign(Assingment, req.body);
        const savedChallenge = await Assingment.save();
        res.send(savedChallenge)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})
route.get("/Assingments", Protect, async (req, res) => {
    try {
        const Assingments = await Assingment_Model.find({
            Instructor: req?.user?._id
        })
        res.send(Assingments)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
route.get("/Assingments/:id", Protect, async (req, res) => {
    try {
        const Assingments = await Assingment_Model.findOne({
            _id: req.params.id
        })
        res.send(Assingments)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


route.get("/Students", Protect, async (req, res) => {
    try {

        const data = await User_Model.findOne({ email: "A@gmail.com" })
            .populate({ path: "students", select: "-password -students -createdAt -updatedAt -email" })
            .select("-password");
        res.status(200).json({ Students: data.students })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

route.get("/student", Protect, async (req, res) => {
    try {

        const assignments = await Assingment_Model.find({
            "settings.groupSettings.groupsDetail": {
                $elemMatch: {
                    $elemMatch: { _id: req.user._id }
                }
            },
            "settings.visibility": "public"
        });


        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: "No assignments found for this student" });
        }

        const assignmentIds = assignments.map(a => a._id.toString());

        // 1. Find submissions with status = submitted
        const submittedSubmissions = await PartialSubmission_Model.find({
            assignmentId: { $in: assignmentIds },
            Students: { $elemMatch: { _id: req.user._id } },
            status: "submitted"
        });

        const submittedIds = submittedSubmissions.map(ps => ps.assignmentId.toString());


        const validAssignmentIds = assignmentIds.filter((id) => !submittedIds.includes(id));


        const partialSubmissions = await PartialSubmission_Model.find({
            assignmentId: { $in: validAssignmentIds },
            Students: { $elemMatch: { _id: req.user._id } },
            status: { $ne: "submitted" }
        });

        const result = validAssignmentIds.map(id => {
            const assignment = assignments.find(a => a._id.toString() === id);
            const partial = partialSubmissions.find(ps => ps.assignmentId.toString() === id);

            return {
                assignment,
                partial
            };
        });
        const DisplayAssingment = result.map((item) => item.assignment)
        res.json(DisplayAssingment);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = route