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
