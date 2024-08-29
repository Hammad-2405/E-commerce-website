const Product = require('../models/Product');
const User = require('../models/User');
const multer = require('multer');
const { cloudinaryUploader } = require('../config/cloudinaryconfig');
const fs = require('fs');

// const path = require('path');

// const imageUpload = async (request, response) => {
//   try {
//       // console.log("request", request.file)
//       // Upload an image
//       const uploadResult = await cloudinaryUploader.upload(request.file.path)
//       // console.log("uploadResult", uploadResult)
//       fs.unlinkSync(request.file.path)
//       response.json({
//           data:
//           {
//               url: uploadResult.secure_url,
//               name: uploadResult.original_filename,
//           }
//           ,
//           status: true,
//           message: "Image upload successfully!"
//       })
//   } catch (error) {
//       response.json({
//           data:
//               []
//           ,
//           status: false,
//           message: error.message
//       })
//   }
// }

const productView = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the seller by username
    const seller = await User.findOne({ username });

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ error: 'Seller not found or user is not a seller' });
    }

    // Find products by matching the seller's ObjectId
    const products = await Product.find({ seller: seller._id });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const addProduct = async (req, res) => {
  try {
    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await cloudinaryUploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); // Delete the temp file
      imageUrl = uploadResult.secure_url; // Get the image URL from Cloudinary
    }

    const { name, description, price, seller } = req.body;

    // Ensure that all required fields are present
    if (!name || !description || !price || !seller) {
      return res.status(400).json({ error: 'All fields except image are required' });
    }

    // Find the seller by username
    const foundSeller = await User.findOne({ username: seller });

    if (!foundSeller || foundSeller.role !== 'seller') {
      return res.status(400).json({ error: 'Seller not found or user is not a seller' });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      image: imageUrl, // Store the image URL
      seller: foundSeller._id,
    });

    // Save the new product
    const savedProduct = await newProduct.save();

    // Update the seller's store with the new product
    if (foundSeller.seller?.store) {
      foundSeller.seller.store.products.push(savedProduct._id);
      await foundSeller.save(); // Save the updated seller document
    } else {
      return res.status(400).json({ error: 'Seller does not have a store' });
    }

    res.status(201).json({ message: 'Product added and store updated successfully!', product: savedProduct });
  } catch (error) {
    console.error('Error in adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const randomProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching random products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const search = async (req, res) => {
  try {
    const query = req.query.query;
    const regex = new RegExp(query, 'i'); // Case-insensitive match

    // Search for matching products
    const products = await Product.find({ name: regex }).limit(10);

    // Search for matching stores within the seller schema
    const usersWithStores = await User.find({
      'seller.store.name': regex,
    }).select('seller.store.name seller.store.owner').limit(10);

    const stores = usersWithStores.map(user => ({
      _id: user._id, // User ID
      storeName: user.seller.store.name,
      owner: user.seller.store.owner,
    }));

    res.status(200).json({ products, stores });
  } catch (error) {
    console.error('Error searching products or stores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { productView, addProduct, randomProducts, search };
