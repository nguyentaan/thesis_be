const User = require("../../models/user");
const bcrypt = require("bcrypt");


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone} = newUser;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser) {
                resolve({
                    status: "ERR",
                    message: "The email is already",
                });
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone:phone
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdUser,
                });
            }
        } catch (e) {
            reject(e);
            resolve({
                status: "ERR",
            });
        }
    });
};


module.exports = {
    createUser: createUser,
};