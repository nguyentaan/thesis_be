const AuthService = require("../../services/auth/register");

const CreateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber
    } = req.body;
    const response = await AuthService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.error('Error creating user:', e);
    console.error('Stack trace:', e.stack);

    return res.status(404).json({
      message: e,
      details: e.message,
    });
  }
};

module.exports = {
  CreateUser: CreateUser,
};