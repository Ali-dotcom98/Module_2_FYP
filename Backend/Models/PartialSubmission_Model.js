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
            options: [String], // for MCQs only
            marks: { type: Number },
            answer: { type: String },
            isLocked: {
                type: Boolean,
                default: false, // when user submits partial, lock for others
            },
            lockedby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            }
        }
    ],


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

