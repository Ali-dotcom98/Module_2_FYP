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

module.exports = route