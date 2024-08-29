const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middleware/multer');
const router = express.Router();

router.get('/viewProducts/:username', productController.productView);
router.post('/addproduct', upload.single('image') ,productController.addProduct);
router.get('/randomProducts', productController.randomProducts);
router.get('/search', productController.search);

module.exports = router;