const mongoose = require("mongoose");
const cartItemSchema  = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1, required: true },
  size: { type: String, required: true },
});

const cartListSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
})

const Cart = mongoose.model("Cart", cartListSchema);
module.exports = Cart;