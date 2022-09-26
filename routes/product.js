const router = require('express').Router();
const Product = require('../models/product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');


//Create
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        return res.status(200).json(savedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        return res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json("Product deleted...");
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Get product
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Get all products
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;