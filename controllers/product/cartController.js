const Cart = require("../../models/cart");
const Product = require("../../models/product");

// Controller to add an item to the cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity, color } = req.body;
  console.log("Adding to cart:", userId);
  try {
    // Fetch the product price from the product collection
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.price; // Assuming the product has a price field

    // Check if the cart for the user already exists
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, color, price }],
      });
    } else {
      // If cart exists, check if the item is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId && item.color === color
      );

      if (itemIndex > -1) {
        // Item already exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity; // Adjust the quantity as needed
      } else {
        // Item doesn't exist in the cart, add a new item
        cart.items.push({ productId, quantity, color, price });
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

const removeItem = async (req, res) => {
  const { userId, productId, color } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId) && item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

const increaseQuantity = async (req, res) => {
  const { userId, productId, color } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.equals(productId) && item.color === color
    );

    if (!item)
      return res.status(404).json({ message: "Product not found in cart" });

    item.quantity += 1;
    await cart.save();

    res.status(200).json({ message: "Quantity increased", cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

const decreaseQuantity = async (req, res) => {
  const { userId, productId, color } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId) && item.color === color
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "Product not found in cart" });

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      // Decrease the quantity by 1 if it's greater than 1
      item.quantity -= 1;
    } else {
      // Remove the item from the cart if quantity reaches 0
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
};
