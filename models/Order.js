const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  books: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered'],
    default: 'Placed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Prevent OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
