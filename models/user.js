const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  phone: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
  search_history: {
    type: [String],
    default: [],
  },
  order_lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    default: [],
  }, ],
  
});
const User = mongoose.model("User", userSchema);
module.exports = User;
