const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temp folder to store uploaded files


// importing controllers -------------------------------------------------------------------------------------
const { loginController } = require("./controllers/loginController");
const { addStudentController } = require("./controllers/addStudentController");
const { forgotPassword, verifyOtp, resetPassword } = require('./controllers/forgotPassword')
const { addMarksController } = require('./controllers/addMarksController')
const { getStudents, getAllStudents } = require("./controllers/getAllStudentsController")
const { deleteUserController } = require("./controllers/deleteUserController")
const { updateUserController, updateUserMarksController } = require("./controllers/updateUserController")
const { uploadStudentsController } = require('./controllers/uploadStudentsController')
const { uploadMarksController } = require('./controllers/uploadMarksController')

// mongoose connect ------------------------------------------------------------------------------------------
main().catch(err => console.log(err.message));
async function main() {
    mongoose.connect('mongodb://localhost:27017/rms')
}

//middlewares -----------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

//post methods ---------------------------------------------------------------------------------------------
app.post("/login", async (req, res) => {
    loginController(req, res);
})

app.post("/forgot-password", async (req, res) => {
    forgotPassword(req, res)
})

app.post("/verify-otp", async (req, res) => {
    verifyOtp(req, res)
})

app.post("/reset-password", async (req, res) => {
    resetPassword(req, res)
})

app.post("/add-student", async (req, res) => {
    addStudentController(req, res)
})

app.post("/add-mark", async (req, res) => {
    addMarksController(req, res)
})

app.post("/upload-students", upload.single('file'), async (req, res) => {
    uploadStudentsController(req, res)
})

app.post("/upload-marks", upload.single('file'), async (req, res) => {
    uploadMarksController(req, res)
})

//get Methods ---------------------------------------------------------------------------------------------

app.get("/get-students/:internDuration", (req, res) => {
    getStudents(req, res)
})

app.get("/get-all-students", (req, res) => {
    getAllStudents(req, res)
})

//delete methods -------------------------------------------------------------------------------------------

app.delete("/delete-user/:id", (req, res) => {
    deleteUserController(req, res)
})

//update methods --------------------------------------------------------------------------------------------

app.put("/update-user/:id", (req, res) => {
    updateUserController(req, res)
})

app.put("/update-user-marks/:id", (req, res) => {
    updateUserMarksController(req, res)
})


// Server Running and listening on that port -------------------------------------------------------------------
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running on port ${PORT}`)
    }

});