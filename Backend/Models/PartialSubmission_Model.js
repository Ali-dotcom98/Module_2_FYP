const mongoose = require("mongoose");

const partialSubmissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    Questions: [
        {
            type: {
                type: String,
                enum: ["true_false", "mcq", "short_answer", "code"],
                default: "short_answer"
            },
            questionText: { type: String, },
            options: [String],
            marks: { type: Number },
            answer: { type: String },
            isLocked: {
                type: Boolean,
                default: false,
            },
            lockedby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            vote: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        }
    ],

    status: {
        type: String,
        enum: ["in_progress", "submitted", "graded"],
        default: "in_progress"
    },
    obtainedMarks: { type: Number, default: 0 },
    feedback: { type: String },
    isPassed: { type: Boolean, default: false },

    Students: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            name: {
                type: String,
            },

            status: {
                type: String,
                enum: ["Student", "Instructor"],
                default: "Student",
            },
        }
    ]

}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

module.exports = mongoose.model("PartialSubmission", partialSubmissionSchema);

