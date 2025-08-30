const express = require("express");
const { Protect } = require("../Middleware/TokenMiddleware");
const Assingment_Model = require("../Models/Assingment_Model");
const User_Model = require("../Models/User_Model")
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

// GET single assignment where a specific student is enrolled
route.get("/student", Protect, async (req, res) => {
    try {
        console.log(req.user._id);

        const assignment = await Assingment_Model.find({
            "settings.groupSettings.groupsDetail": {
                $elemMatch: {
                    $elemMatch: { _id: req.user._id }
                }
            }
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found for this student" });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = route