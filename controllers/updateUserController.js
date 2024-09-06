const interneesSchema = require("../schemas/interneesSchema");

const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, internDuration } = req.body;

        // Find the user by ID
        const user = await interneesSchema.findOne({ _id: id });
        if (!user) {
            return res.status(201).json({ success: false, error: "User not found" });
        }

        // Check if email already exists and belongs to another user
        const emailExists = await interneesSchema.findOne({ email });
        if (emailExists && emailExists._id.toString() !== id) {
            return res.status(201).json({ success: false, error: "Email already exists" });
        }

        // Update fields
        user.username = username;
        user.email = email;
        user.phone = phone;
        user.internDuration = internDuration;

        // Save the document
        await user.save();

        res.status(200).json({ success: true, message: "User updated successfully", user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateUserMarksController = async (req, res) => {
    try {
        const { id } = req.params;
        const { attendanceMarks, projectReviewMarks, assessmentMarks, projectSubmissionMarks, linkedInPostMarks } = req.body;

        // Find the user by ID
        const user = await interneesSchema.findOne({ _id: id });
        if (!user) {
            return res.status(201).json({ success: false, error: "User not found" });
        }

        // Update the marks
        user.attendanceMarks = attendanceMarks;
        user.projectReviewMarks = projectReviewMarks;
        user.assessmentMarks = assessmentMarks;
        user.projectSubmissionMarks = projectSubmissionMarks;
        user.linkedInPostMarks = linkedInPostMarks;

        // Save the updated document
        await user.save();

        res.status(200).json({ success: true, message: "Marks updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { updateUserController, updateUserMarksController };
