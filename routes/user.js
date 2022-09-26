const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

//Update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: req.body,
            }, { new: true }
        );
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("User deleted...");
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Get user
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        return res.status(200).json(others);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Get all users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;