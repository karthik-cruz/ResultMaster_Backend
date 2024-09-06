const interneesSchema = require("../schemas/interneesSchema");

const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await interneesSchema.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });

        // Handle error if user not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { deleteUserController };
