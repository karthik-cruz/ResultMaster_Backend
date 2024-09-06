const interneesSchema = require("../schemas/interneesSchema");

const addMarksController = async (req, res) => {
    try {
        const { email, attendanceMarks, projectReviewMarks, assessmentMarks, projectSubmissionMarks, linkedInPostMarks } = req.body;

        // Validate input fields
        if (!email || !attendanceMarks || !projectReviewMarks || !assessmentMarks || !projectSubmissionMarks || !linkedInPostMarks) {
            return res.status(201).json({ error: "All fields are required" });
        }

        // Check if the user exists
        const user = await interneesSchema.findOne({ email });
        if (!user) {
            return res.status(201).json({ error: "User not found" });
        }

        // Update the user's marks
        user.attendanceMarks = attendanceMarks;
        user.projectReviewMarks = projectReviewMarks;
        user.assessmentMarks = assessmentMarks;
        user.projectSubmissionMarks = projectSubmissionMarks;
        user.linkedInPostMarks = linkedInPostMarks;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "Marks added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addMarksController };
