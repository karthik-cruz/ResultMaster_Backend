const interneesSchema = require("../schemas/interneesSchema");
const XLSX = require('xlsx');
const fs = require('fs');

const uploadMarksController = async (req, res) => {
    try {
        // Ensure the file exists and is an Excel file
        if (!req.file || !req.file.path || !req.file.originalname.match(/\.(xls|xlsx)$/)) {
            return res.status(201).json({ message: 'Please upload a valid Excel file.', success: false });
        }

        // Read the Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Arrays to store the results
        const updatedStudents = [];
        const notFoundStudents = [];

        // Iterate through the rows of the Excel sheet
        for (let row of sheetData) {
            // Check for the required fields
            if (!row['EMAIL'] || !row['ATTENDANCE MARKS'] || !row['PROJECT REVIEW MARKS'] || !row['ASSESSMENT MARKS'] || !row['PROJECT SUBMISSION MARKS'] || !row['LINKEDIN POST MARKS']) {
                return res.status(201).json({ message: 'Missing fields in the Excel sheet.', success: false });
            }

            // Find the user by email
            const existingUser = await interneesSchema.findOne({ email: row['EMAIL'] });

            if (existingUser) {
                // Update the user's marks
                existingUser.attendanceMarks = row['ATTENDANCE MARKS'];
                existingUser.projectReviewMarks = row['PROJECT REVIEW MARKS'];
                existingUser.assessmentMarks = row['ASSESSMENT MARKS'];
                existingUser.projectSubmissionMarks = row['PROJECT SUBMISSION MARKS'];
                existingUser.linkedInPostMarks = row['LINKEDIN POST MARKS'];

                // Save the updated user
                await existingUser.save();

                // Add the updated user to the updatedStudents array
                updatedStudents.push(existingUser.email);
            } else {
                // Add the user to the notFoundStudents array if no user exists with the email
                notFoundStudents.push(row['EMAIL']);
            }
        }

        // Optionally, delete the file after processing
        fs.unlinkSync(req.file.path);

        // Create the message with details of updated and not found students
        let message = 'Marks update process completed';
        if (updatedStudents.length > 0) {
            message += ` for ${updatedStudents?.length} users`
        }
        if (notFoundStudents.length > 0) {
            message += ` Students not found: ${notFoundStudents.join(', ')}.`;
        }

        // Respond with the summary
        return res.status(200).json({
            message,
            success: true,
            totalUpdated: updatedStudents.length,
            totalNotFound: notFoundStudents.length
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error processing the file: ' + err.message, success: false });
    }
};

module.exports = { uploadMarksController };
