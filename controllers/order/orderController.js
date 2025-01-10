const Cart = require("../../models/cart");
const Order = require("../../models/Order");
const Product = require("../../models/product");

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    // Process each item in the cart
    const orderItems = cart.items.map((item) => {
      const { price, total_stock, color, image_url } = item.productId; // Get the image_url here
      const normalizedColor = item.color.trim().toLowerCase();

      if (normalizedColor !== color.trim().toLowerCase()) {
        throw new Error(
          `Color ${item.color} does not match available color for product ${item.productId.name}`
        );
      }

      if (total_stock < item.quantity) {
        throw new Error(
          `Not enough stock for product ${item.productId.name} in color ${item.color}`
        );
      }

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        color: item.color,
        price: price,
        total_stock,
        image_url, // Add the image_url to the order item
      };
    });

    // Calculate total amount and add a $5 shipping fee
    const itemsTotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const shippingFee = 5;
    const totalAmount = itemsTotal + shippingFee;

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

    // Deduct stock and increment sold_count for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.total_stock < item.quantity) {
        throw new Error(
          `Not enough stock for product ${product.name} in color ${item.color}`
        );
      }

      // Deduct stock
      product.total_stock -= item.quantity;

      // Increment sold_count
      product.sold_count += item.quantity;

      console.log(
        `After Deduction: Product - ${product.name}, Stock: ${product.total_stock}, Sold Count: ${product.sold_count}`
      );

      await product.save();
    }

    // Clear the user's cart after order creation
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
    const { userId } = req.params; // Destructure for cleaner code

    // Check if the userId is valid (you can add more validation if needed)
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Retrieve orders for the user and populate productId field
    const orders = await Order.find({ userId }).populate({
      path: "items.productId", // Populate the productId in items array
      select: "name price image_url", // Include the image_url field (adjust field name based on your model)
    });

    // If no orders are found for the user, return a 404 response
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Respond with the orders and a success message
    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);

    // If an error occurs, return a 500 status with the error message
    return res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};



const cancelOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ userId, _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is already processed or cannot be cancelled
    if (order.status === "processed" || order.status === "shipped") {
      return res.status(400).json({
        message: "Order is already processed and cannot be cancelled",
      });
    }

    // Restore stock for each item
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found during stock restoration");
      }

      product.total_stock += item.quantity;

      console.log(
        `After Restoration: Product - ${product.name}, Stock: ${product.total_stock}`
      );

      await product.save();
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to cancel order", error: error.message });
  }
};

module.exports = { createOrderFromCart, getOrdersByUserId, cancelOrder };
