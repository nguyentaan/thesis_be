const AuthService = require("../../services/auth/register");

const CreateUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    console.log("Request body:", req.body);  // Log the incoming request body

    const response = await AuthService.createUser(req.body);
    
    console.log("AuthService.createUser response:", response);  // Log the response from AuthService

    // Check if the user creation was successful
    if (response.status === "OK") {
      return res.status(201).json(response);
    } else {
      return res.status(400).json(response); // Bad request, e.g., if email is already registered
    }
  } catch (e) {
    console.error("Error creating user:", e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while creating the user",
      details: e.message,
    });
  }
};

module.exports = {
  CreateUser,
};
