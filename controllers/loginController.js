// schemas import -------------------------------------------------------------------------------------------
const adminSchema = require("../schemas/adminSchema");
const interneesSchema = require("../schemas/interneesSchema");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY || "@K.s1501"




const loginController = async (req, res) => {
    try {
        const { email, password, phone } = req.body;

        if (!phone) {
            // Check if all fields are provided
            if (!email || !password) {
                return res.status(201).json({ success: false, error: "All fields are required" });
            }

            // Check if the user exists
            const user = await adminSchema.findOne({ email });
            if (!user) {
                return res.status(201).json({ success: false, error: "User not found" });
            }

            // Check if the password is correct
            const isMatch = password === user.password;
            if (!isMatch) {
                return res.status(201).json({ success: false, error: "Invalid password" });
            }
            // Generate JWT token and admin true
            const token = jwt.sign({ userId: user._id }, SECRET_KEY);
            res.status(200).json({ success: true, token, user, message: "Login successfully", isAdmin: true, });

        } else {
            // Check if all fields are provided
            if (!email || !phone) {
                return res.status(201).json({ error: "All fields are required" });
            }
            //check if user exists

            const user = await interneesSchema.findOne({ email });
            if (!user) {

                return res.status(201).json({ success: false, error: "User not found" });
            }
            // Check if the phone is correct
            const isMatch = phone === user.phone;
            if (!isMatch) {
                return res.status(201).json({ error: "Invalid phone number" });
            }

            // Generate JWT token and admin false
            const token = jwt.sign({ userId: user._id }, SECRET_KEY);
            res.status(200).json({ success: true, token, user, message: "Login successfully", });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

};

module.exports = { loginController };
