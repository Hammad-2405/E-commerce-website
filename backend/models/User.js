const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Buyer Schema
const buyerSchema = new mongoose.Schema({
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  orders: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referring to seller
      quantity: { type: Number, required: true },
      status: { type: String, default: 'Pending' },
    },
  ],
});

// Store Schema
const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the seller
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

// Seller Schema
const sellerSchema = new mongoose.Schema({
  store: storeSchema,
  orders: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referring to buyer
      quantity: { type: Number, required: true },
      status: { type: String, default: 'Pending' },
    },
  ],
});

// Main User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  buyer: { type: buyerSchema },
  seller: { type: sellerSchema },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
