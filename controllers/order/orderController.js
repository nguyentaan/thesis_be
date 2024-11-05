const Cart = require("../../models/cart");
const Order = require("../../models/Order");

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from the request parameters
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    // Clean and parse `price`, ensuring it only includes numeric values
    const orderItems = cart.items.map((item) => {
      const rawPrice = item.productId.price;
      const price = parseFloat(rawPrice.replace(/[^\d.]/g, "")); // Remove non-numeric characters

      if (isNaN(price)) throw new Error("Invalid price format");

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        size: item.size,
        price: price,
      };
    });

    // Calculate totalAmount based on cleaned prices
    const totalAmount = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      paymentMethod: req.body.paymentMethod,
      shipping_address: req.body.shipping_address,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
    });

    await order.save();

    // Update product quantities in stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (product) {
        // Find the size within the product's sizes array
        const productSize = product.sizes.find(
          (size) => size.size_name === item.size
        );

        if (productSize) {
          // Decrease stock by the quantity ordered
          productSize.stock -= item.quantity;

          // Prevent stock from going negative
          if (productSize.stock < 0) {
            return res.status(400).json({
              message: `Not enough stock for size ${item.size} of product ${product.name}.`,
            });
          }
        } else {
          return res.status(400).json({
            message: `Size ${item.size} not found for product ${product.name}.`,
          });
        }

        // Save the updated product
        await product.save();
      } else {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found.` });
      }
    }

    // Clear the user's cart after the order is created
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ userId }).populate("items.productId");

    if (!orders || orders.length === 0)
      return res.status(404).json({ message: "No orders found" });

    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: error.message });
  }
};

module.exports = { createOrderFromCart, getOrdersByUserId };
