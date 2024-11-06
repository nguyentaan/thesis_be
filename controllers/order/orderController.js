const Cart = require("../../models/cart");
const Order = require("../../models/Order");
const Product = require("../../models/product");

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "sizes", // Populate the sizes array in the Product model
        select: "size_name stock", // Ensure that only size_name and stock are selected
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    // Clean and parse `price`, ensuring it only includes numeric values
    const orderItems = cart.items.map((item) => {
      const rawPrice = item.productId.price;
      const price = parseFloat(rawPrice.replace(/[^\d.]/g, ""));

      if (isNaN(price)) throw new Error("Invalid price format");

      // Normalize size to ensure correct comparison (case-insensitive)
      const normalizedSize = item.size.trim().toLowerCase();

      // Find matching size for the product
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

      // Deduct stock from the product size
      productSize.stock -= item.quantity;

      // Log the stock after deduction for debugging
      console.log(
        `After Deduction: ${productSize.size_name} - Stock: ${productSize.stock}`
      );

      // Save the product after deducting the stock
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

module.exports = { createOrderFromCart, getOrdersByUserId };
