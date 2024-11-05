const User = require("../../models/user");
const bcrypt = require("bcrypt");

const createUser = async (newUser) => {
    const { name, email, password, phone } = newUser;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return {
                status: "ERR",
                message: "The email is already registered",
            };
        }

        const hash = bcrypt.hashSync(password, 10);
        const createdUser = await User.create({
            name,
            email,
            password: hash,
            phone
        });

        return {
            status: "OK",
            message: "User created successfully",
            data: createdUser,
        };

    } catch (e) {
        console.error("Error creating user:", e);
        return {
            status: "ERR",
            message: "An error occurred while creating the user",
            details: e.message,
        };
    }
};

module.exports = {
    createUser,
};
