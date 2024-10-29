const Cart = require("../../models/cart");

// Controller to add an item to the cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity, size } = req.body;

  try {
    // Check if the cart for the user already exists
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, size }],
      });
    } else {
      // If cart exists, check if the item is already in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.size === size);

      if (itemIndex > -1) {
        // Item already exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity; // Adjust the quantity as needed
      } else {
        // Item doesn't exist in the cart, add a new item
        cart.items.push({ productId, quantity, size });
      }
    }

    // Save the cart
    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId"); // Populate product details
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params; // Get userId and productId from URL params
    const cart = await CartList.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } }, // Remove item from the items array
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $inc: { "items.$.quantity": 1 } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the cart and check the quantity of the product
    const cart = await Cart.findOne({ userId, "items.productId": productId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (item.quantity > 1) {
      // Decrease quantity if it's greater than 1
      item.quantity -= 1;
      await cart.save();
      res.status(200).json(cart);
    } else {
      // Remove product if quantity reaches 0
      await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      );
      res.status(200).json({ message: "Product removed from cart", cart });
    }
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  addToCart,
  getCart,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
};
