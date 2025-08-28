const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["true_false", "mcq", "short_answer", "code"],
        default: "short_answer"
    },
    questionText: { type: String, },
    options: [String], // for MCQs only
    correctAnswer: mongoose.Schema.Types.Mixed, // can be boolean, string, or array
    marks: { type: Number },
    answer: { type: String },
});

const AssignmentSchema = new mongoose.Schema({
    Instructor: {
        type: String
    },
    // Basic Info
    title: { type: String },
    description: { type: String },
    dueDate: { type: Date },
    totalMarks: { type: Number },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },

    // Assignment Body
    questions: [QuestionSchema],
    sections: [
        {
            title: String,
            description: String,
            questions: [QuestionSchema],
        }
    ],

    // Assignment Settings
    settings: {
        groupSettings: {
            numberOfGroups: { type: Number, default: 1 },
            studentsPerGroup: { type: Number },
            assignmentMode: { type: String, enum: ["random", "instructor"], default: "random" },
            groupsDetail: [
                [{
                    _id: String,
                    name: String,
                    status: String
                }]
            ]
        },
        allowLateSubmission: { type: Boolean, default: false },
        visibility: { type: String, enum: ["public", "private"], default: "private" }
    },
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

module.exports = mongoose.model("Assignment", AssignmentSchema);
