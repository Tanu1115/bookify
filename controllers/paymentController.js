const Razorpay = require("razorpay");
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.renderPaymentPage = (req, res) => {
  res.render("payment", { key_id: process.env.RAZORPAY_KEY_ID });
};

exports.createOrder = async (req, res) => {
  const options = {
    amount: 50000, // ₹500 in paisa
    currency: "INR",
    receipt: "receipt_order_123"
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Error creating order", err);
    res.status(500).send("Error creating order");
  }
};
