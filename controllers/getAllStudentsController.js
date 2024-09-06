const interneesSchema = require("../schemas/interneesSchema");

const getAllStudents = async (req, res) => {
    try {

        const students = await interneesSchema.find();
        res.status(200).json({ students });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getStudents = async (req, res) => {
    try {

        const { internDuration } = req.params;
        const students = await interneesSchema.find({ internDuration });
        res.status(200).json({ students: students.map((student) => ({ id: student._id, username: student.username })) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getAllStudents, getStudents };
