const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const RefreshToken = require("../../models/refresh_token");

dotenv.config();

const NewRefreshToken = async (req, res, next) => {
    try {
        const { _id, email, isAdmin, refreshToken } = req.body;
        
        // Check if refresh token exists in database
        const tokenRecord = await RefreshToken.findOne({ userId: _id, token: refreshToken });
        
        if (!tokenRecord) {
            return res.status(404).send("Invalid request or refresh token not found");
        }

        // Delete the old refresh token
        await RefreshTokenModel.deleteOne({ userId: _id, token: refreshToken });

        // Generate a new refresh token
        const user = { _id, email, isAdmin };
        const newRefreshToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE });

        // Calculate expiration date
        const expiresAt = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFE) * 1000);

        // Save the new refresh token in the database
        await RefreshTokenModel.create({
            userId: _id,
            token: newRefreshToken,
            expiresAt: expiresAt,
        });

        return res.status(200).json({ refresh_token: newRefreshToken });

    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).send("Internal server error");
    }
};

module.exports = {
    NewRefreshToken: NewRefreshToken,
};
