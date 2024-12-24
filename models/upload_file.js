const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// File upload schema
const fileUploadSchema = new Schema({
  file_name: {
    type: String,
    required: true, // Add this if file_name is necessary
  },
  file_type: {
    type: String,
    required: true,
  },
  create_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  update_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  chunk_lists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
});

module.exports = model("UploadFile", fileUploadSchema);
