const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.renderCheckoutPage = (req, res) => {
  const cart = {
    items: [
      { bookId: { title: "JavaScript Mastery", price: 250 }, quantity: 2 },
      { bookId: { title: "Node.js Guide", price: 200 }, quantity: 1 }
    ]
  };
  res.render("checkout", { cart });
};

exports.createOrder = async (req, res) => {
  const { totalAmount } = req.body;

  const options = {
    amount: totalAmount * 100, // Convert ₹ to paise
    currency: "INR",
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`
  };

  try {
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ success: false });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    formData
  } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    console.log(" Payment verified for:", formData.email);
    return res.status(200).json({ success: true });
  } else {
    console.log(" Payment verification failed");
    return res.status(400).json({ success: false });
  }
};
