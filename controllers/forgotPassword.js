const bcrypt = require('bcryptjs')
const adminSchema = require("../schemas/adminSchema");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const PASSWORD = process.env.PASSWORD
const EMAIL = process.env.EMAIL


const forgotPassword = async (req, res) => {
    try {
        //check if email is provided
        const { email } = req.body;
        if (!email) {
            return res.status(201).json({ error: "All fields are required" });
        }

        const user = await adminSchema.findOne({ email });
        if (!user) {
            return res.status(201).json({ error: "User not found" });
        }

        //Generate 6 Digit otp 
        const otp = crypto.randomInt(100000, 999999);
        //otp expiry in 15 min
        const otpExpiry = Date.now() + 15 * 60 * 1000;
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        //send otp via email with nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        });
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: 'OTP for forgot password',
            text: `Your OTP is ${otp} valid for 15 minutes`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: "Internal server error" });
            } else {
                console.log('Email sent:' + info.response);
                res.status(200).json({ message: "OTP sent to your email" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await adminSchema.findOne({ email });

        if (!user) {
            return res.status(201).json({ error: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(201).json({ error: 'Invalid or expired OTP' });
        }

        await adminSchema.updateOne(
            { email: user.email },
            { $unset: { otp: "", otpExpiry: "" } }
        );
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await adminSchema.findOne({ email });

        if (!user) {
            return res.status(201).json({ error: 'User not found' });
        }
        // Update the user's password
        user.password = password
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { forgotPassword, verifyOtp, resetPassword };