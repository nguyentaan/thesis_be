const User = require("../../models/user");

const UpdateSearchHistory = async (req, res) => {
  try {
    const { query, user_id } = req.body;

    // Fetch user by ID and update the search history field
    let user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }

    // Avoid adding duplicate queries in search history
    if (!user.search_history.includes(query)) {
      user.search_history.unshift(query);

      // Retry logic for version errors
      let saved = false;
      while (!saved) {
        try {
          await user.save();
          saved = true;
        } catch (error) {
          if (error.name === "VersionError") {
            console.log("Version conflict detected, retrying...");
            // Refetch the document to get the latest version
            user = await User.findById(user_id);

            // Ensure no duplicate entries
            if (!user.search_history.includes(query)) {
              user.search_history.unshift(query);
            }
          } else {
            throw error; // Handle other errors separately
          }
        }
      }
    }

    console.log("User saved", user.search_history);
    return res.status(200).json({
      status: "OK",
      message: "Search history updated successfully",
      data: user.search_history,
    });
  } catch (e) {
    console.error("Error updating search history:", e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while updating search history",
      details: e.message,
    });
  }
};

module.exports = {
  UpdateSearchHistory,
};
