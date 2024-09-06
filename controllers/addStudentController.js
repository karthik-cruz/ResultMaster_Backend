const interneesSchema = require("../schemas/interneesSchema");

const addStudentController = async (req, res) => {
    try {
        const { username, email, phone, internDuration } = req.body;


        // Validate input fields
        if (!username || !email || !phone || !internDuration) {
            return res.status(201).json({ error: "All fields are required" });
        }

        let user, newUser;


        // Check if the user already exists and phone number already exists
        user = await interneesSchema.findOne({ email });
        if (user) {
            return res.status(201).json({ error: "User already exists" });

        }

        // Add the user if they don't exist
        newUser = new interneesSchema(req.body);
        await newUser.save();
        res.status(200).json({ message: "User added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addStudentController };
