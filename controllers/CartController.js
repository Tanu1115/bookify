const Book = require('../models/Book');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// 1️⃣ Add to Cart
const addToCart = async (req, res) => {
  if (!res.locals.user) return res.redirect('/auth/login');

  const userId = res.locals.user._id;
  const bookId = req.params.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.bookId.equals(bookId));

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ bookId, quantity: 1 });
    }

    await cart.save();
    res.redirect('/cart');
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).send("Something went wrong.");
  }
};

// 2️⃣ View Cart Page
const getCartPage = async (req, res) => {
  if (!res.locals.user) return res.redirect('/auth/login');

  try {
    const cart = await Cart.findOne({ userId: res.locals.user._id }).populate('items.bookId');
    res.render('user/cart', {
      cart,
      user: res.locals.user
    });
  } catch (error) {
    console.error("Cart page error:", error.message);
    res.status(500).send("Server error");
  }
};

// 3️⃣ Show Checkout Page
const getCheckoutPage = async (req, res) => {
  if (!res.locals.user) return res.redirect('/auth/login');

  try {
    const cart = await Cart.findOne({ userId: res.locals.user._id }).populate('items.bookId');
    res.render('user/checkout', {
      cart,
      user: res.locals.user
    });
  } catch (error) {
    console.error("Checkout page error:", error.message);
    res.status(500).send("Server error");
  }
};

// 4️⃣ Place Order
const placeOrder = async (req, res) => {
  if (!res.locals.user) return res.redirect('/auth/login');

  const { name, address } = req.body;

  try {
    const cart = await Cart.findOne({ userId: res.locals.user._id }).populate('items.bookId');

    if (!cart || cart.items.length === 0) {
      return res.redirect('/cart');
    }

    let total = 0;
    cart.items.forEach(item => {
      total += item.bookId.price * item.quantity;
    });

    const order = new Order({
      userId: res.locals.user._id,
      name,
      address,
      items: cart.items,
      total
    });

    await order.save();

    // ✅ Clear cart items instead of deleting the whole cart
    cart.items = [];
    await cart.save();

    res.redirect('/order/success');
  } catch (error) {
    console.error("Place order error:", error.message);
    res.status(500).send("Order failed.");
  }
};


const getOrderSuccessPage = (req, res) => {
  res.render('user/ordersuccess');
};
//Buy now


// ✅ Export all
module.exports = {
  addToCart,
  getCartPage,
  getCheckoutPage,
  placeOrder,
  getOrderSuccessPage
};
