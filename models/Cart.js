const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model.Cart || mongoose.model('Cart', cartSchema);
