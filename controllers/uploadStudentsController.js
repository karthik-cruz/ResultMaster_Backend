const interneesSchema = require("../schemas/interneesSchema");
const XLSX = require('xlsx');
const fs = require('fs');

const uploadStudentsController = async (req, res) => {
    try {
        // Ensure the file exists and is an Excel file
        if (!req.file || !req.file.path || !req.file.originalname.match(/\.(xls|xlsx)$/)) {
            return res.status(201).json({message :'Please upload a valid Excel file.',success:false});
        }

        // Read the Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Validate and map the data to users array
        const users = sheetData.map((row) => {
            if (!row['NAME'] || !row['EMAIL'] || !row['PHONE NUMBER'] || !row['INTERN DURATION']) {
                throw new Error('Missing fields in the Excel sheet.');
            }

            return {
                username: row['NAME'],
                email: row['EMAIL'],
                phone: row['PHONE NUMBER'],
                internDuration: row['INTERN DURATION']
            };
        });

        // Arrays to store valid users and not added users
        const usersToInsert = [];
        const notAddedStudents = [];

        // Check for existing users and prepare both lists
        for (let user of users) {
            const existingUser = await interneesSchema.findOne({ email: user.email });

            if (!existingUser) {
                usersToInsert.push(user); // Add to valid users list
            } else {
                // Push users not added into the notAddedStudents array with a reason
                notAddedStudents.push({
                    email: user.email,
                    username: user.username,
                    reason: 'User already exists'
                });
            }
        }

        // Insert new users if there are any to insert
        let insertedCount = 0;
        if (usersToInsert.length > 0) {
            await interneesSchema.insertMany(usersToInsert);
            insertedCount = usersToInsert.length;
        }

        // Optionally, delete the file after processing
        fs.unlinkSync(req.file.path);

        // Respond with the summary -------------------
        if (insertedCount === 0) {
            return res.status(201).json({ message: "No users Added, check the file and try again ", success: false });
        }

        return res.status(200).json({
            message: `${insertedCount} users added successfully.`,
            success: true,
            totalUsersAdded: insertedCount,
            notAddedStudents: notAddedStudents, // JSON format of users not added
            totalNotAdded: notAddedStudents.length,
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the file: ' + err.message);
    }
};


module.exports = { uploadStudentsController };
