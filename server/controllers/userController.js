const User = require("../models/User");


// ==========================
// GET USER PROFILE
// ==========================
const getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ✅ FIX IMAGE PATH BEFORE SENDING
        if (user.profileImage) {
            user.profileImage = user.profileImage.replace(/\\/g, "/");
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });

    }

};
// ==========================
// UPDATE USER PROFILE
// ==========================
const updateUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        // 🔥 IMAGE FIX (SAFE & CLEAN)
        if (req.file) {

            let filePath = req.file.path;

            // convert Windows "\" to "/"
            filePath = filePath.replace(/\\/g, "/");

            // ✅ ALWAYS FORCE uploads/ prefix (no substring risk)
            const fileName = filePath.split("/").pop();
            user.profileImage = `uploads/${fileName}`;
        }

        const updatedUser = await user.save();

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });

    }

};


// ==========================
// DELETE USER ACCOUNT
// ==========================
const deleteUserAccount = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await user.deleteOne();

        res.json({
            message: "User account deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting account",
            error: error.message
        });

    }

};


// ==========================
// GET USER BY ID (PUBLIC)
// ==========================
const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });

    }

};


// ==========================
// GET ALL USERS
// ==========================
const getUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });

    }

};


module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getUserById,
    getUsers
};