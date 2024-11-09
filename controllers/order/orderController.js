const Cart = require("../../models/cart");
const Order = require("../../models/Order");
const Product = require("../../models/product");

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "sizes",
        select: "size_name stock",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    // Process each item in the cart
    const orderItems = cart.items.map((item) => {
      const rawPrice = item.productId.price;
      const price = parseFloat(rawPrice.replace(/[^\d.]/g, ""));

      if (isNaN(price)) throw new Error("Invalid price format");

      const normalizedSize = item.size.trim().toLowerCase();

      const productSize = item.productId.sizes?.find(
        (size) => size.size_name.trim().toLowerCase() === normalizedSize
      );

      if (!productSize) {
        throw new Error(
          `Size ${item.size} not found for product ${item.productId.name}`
        );
      }

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        size: item.size,
        price: price,
        stock: productSize.stock,
      };
    });

    // Calculate total amount for items and add a $5 shipping fee
    const itemsTotal = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

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

    // Deduct stock for each item in the order
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const productSize = product.sizes.find(
        (size) =>
          size.size_name.trim().toLowerCase() === item.size.trim().toLowerCase()
      );

      if (!productSize) {
        throw new Error(
          `Size ${item.size} not found for product ${product.name}`
        );
      }

      if (productSize.stock < item.quantity) {
        throw new Error(`Not enough stock for size ${item.size}`);
      }

      productSize.stock -= item.quantity;

      console.log(
        `After Deduction: ${productSize.size_name} - Stock: ${productSize.stock}`
      );

      await product.save();
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

const cancelOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ userId, _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //Check if the order is already processed or cannot be cancelled
    if (order.status === "processed" || order.status === "shipped") {
      return res.status(400).json({
        message: "Order is already processed and cannot be cancelled",
      });
    }

    //Restore the stock for each item in the order
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found during stock restoration");
      }

      const productSize = product.sizes.find(
        (size) =>
          size.size_name.trim().toLowerCase() === item.size.trim().toLowerCase()
      );

      if (productSize) {
        productSize.stock += item.quantity;

        //Log the stock after restoration for debugging
        console.log(
          `After Restoration: ${productSize.size_name} - Stock: ${productSize.stock}`
        );
        await product.save();
      }
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
