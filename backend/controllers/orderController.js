// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const viewSellerOrders = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).populate('seller.orders.product').populate('seller.orders.buyer');

    if (!user || !user.seller) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    const orders = user.seller.orders;

    if (!orders.length) {
      return res.status(404).json({ success: false, error: 'No orders found for this seller' });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


// View Orders for Buyer
const viewBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user._id; // Use req.user to get the buyer ID
    const orders = await Order.find({ buyerId });

    if (!orders.length) {
      return res.status(404).json({ success: false, error: 'No orders found for this buyer' });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const checkout = async (req, res) => {
  const { cart, buyerUsername } = req.body;

  console.log('Request body:', req.body);

  if (!cart || !Array.isArray(cart) || !buyerUsername) {
    return res.status(400).json({ message: 'Invalid request payload' });
  }

  try {
    // Check if the buyer exists
    const buyer = await User.findOne({ username: buyerUsername });
    console.log('Fetched buyer:', buyer);
    if (!buyer) {
      return res.status(400).json({ message: 'Buyer not found' });
    }

    // Initialize buyer object if not present
    if (!buyer.buyer) {
      buyer.buyer = { orders: [] }; // Initialize buyer.buyer with orders
    } else if (!buyer.buyer.orders) {
      buyer.buyer.orders = []; // Initialize orders if present but empty
    }

    for (const cartItem of cart) {
      console.log('Processing cart item:', cartItem);

      const product = await Product.findById(cartItem._id).populate('seller');
      console.log('Fetched product:', product);

      if (!product) {
        return res.status(400).json({ message: `Product not found: ${cartItem._id}` });
      }

      const seller = await User.findById(product.seller._id);
      console.log('Fetched seller:', seller);

      if (!seller) {
        return res.status(400).json({ message: 'Seller not found' });
      }

      // Initialize seller object if not present
      if (!seller.seller) {
        seller.seller = { orders: [] }; // Initialize seller.seller with orders
      } else if (!seller.seller.orders) {
        seller.seller.orders = []; // Initialize orders if present but empty
      }

      // Add the order to the seller's orders
      seller.seller.orders.push({
        product: product._id,
        buyer: buyer._id,
        quantity: cartItem.quantity || 1,
      });

      // Add the order to the buyer's orders
      buyer.buyer.orders.push({
        product: product._id,
        seller: seller._id,
        quantity: cartItem.quantity || 1,
      });

      await seller.save();
      await buyer.save();
    }

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Server error during checkout' });
  }
};


module.exports = { viewSellerOrders, viewBuyerOrders, checkout };
