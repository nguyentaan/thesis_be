const User = require("../../../models/user");

const UpdateSearchHistory = async (req, res) => {
  try {
    const { query, user_id } = req.body;

    // Ensure query and user_id are provided
    if (!query || !user_id) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing query or user_id in the request body",
      });
    }

    // Fetch the user by ID
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    // Check if the query is already in the search history
    if (user.search_history.includes(query)) {
      return res.status(200).json({
        status: "OK",
        message: "Query already exists in search history",
        data: user.search_history,
      });
    }

    // Add the query to the search history (avoid duplicates)
    user.search_history.unshift(query);

    // Save the updated user, with retry logic in case of version conflicts
    let saved = false;
    while (!saved) {
      try {
        await user.save();
        saved = true; // Successfully saved, exit loop
      } catch (error) {
        if (error.name === "VersionError") {
          console.log("Version conflict detected, retrying...");
          // Refetch the user to get the latest version before retrying
          user = await User.findById(user_id);
          if (!user.search_history.includes(query)) {
            user.search_history.unshift(query);
          }
        } else {
          // Throw other errors
          throw error;
        }
      }
    }

    // Respond with success
    return res.status(200).json({
      status: "OK",
      message: "Search history updated successfully",
      data: user.search_history,
    });
  } catch (error) {
    console.error("Error updating search history:", error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while updating search history",
      details: error.message,
    });
  }
};

const RemoveSearchHistoryItem = async (req, res) => {
  try {
    const { query, user_id } = req.body;

    // Ensure query and user_id are provided
    if (!query || !user_id) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing query or user_id in the request body",
      });
    }

    // Fetch the user by ID
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    // Remove the query from search history if it exists
    const index = user.search_history.indexOf(query);
    if (index !== -1) {
      user.search_history.splice(index, 1); // Remove the query
    } else {
      return res.status(404).json({
        status: "ERR",
        message: "Query not found in search history",
      });
    }

    // Save the updated user data
    await user.save();

    return res.status(200).json({
      status: "OK",
      message: "Search history item removed successfully",
      data: user.search_history,
    });
  } catch (error) {
    console.error("Error removing search history item:", error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while removing search history item",
      details: error.message,
    });
  }
};

const ClearAllSearchHistory = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Ensure user_id is provided
    if (!user_id) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing user_id in the request body",
      });
    }

    // Fetch the user by ID
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    // Clear the search history
    user.search_history = [];

    // Save the updated user data
    await user.save();

    return res.status(200).json({
      status: "OK",
      message: "All search history cleared successfully",
      data: user.search_history,
    });
  } catch (error) {
    console.error("Error clearing search history:", error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while clearing search history",
      details: error.message,
    });
  }
};

const UpdateUserProfile = async (req, res) => {
  try {
    const { user_id, update_data } = req.body;

    let user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    // Only update fields that are provided in the request
    if (update_data) {
      Object.keys(update_data).forEach((key) => {
        if (update_data[key] !== null && update_data[key] !== "") {
          user[key] = update_data[key];
        }
      });
      
      // Save the updated user profile
      await user.save();
    }

    console.log("User updated", user);

    return res.status(200).json({
      status: "OK",
      message: "User profile updated successfully",
      data: user,
    });
  } catch (e) {
    console.error("Error updating user profile:", e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while updating the user profile",
      details: e.message,
    });
  }
};


module.exports = {
  UpdateSearchHistory,
  RemoveSearchHistoryItem,
  ClearAllSearchHistory,
  UpdateUserProfile,
};
