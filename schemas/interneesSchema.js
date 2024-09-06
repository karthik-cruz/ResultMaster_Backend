const mongoose = require("mongoose");

const interneesSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    internDuration: {
        type: String,
        required: true
    },
    attendanceMarks: {
        type: String,
    },
    projectReviewMarks: {
        type: String,
    },
    assessmentMarks: {
        type: String,
    },
    projectSubmissionMarks: {
        type: String,
    },
    linkedInPostMarks: {
        type: String,
    }
});
//no need to hash the new password
// adminSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }
//     this.password = this.password;
//     next();
// });

module.exports = mongoose.model("internees", interneesSchema)