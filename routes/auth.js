const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Register
router.post('/register', async (req, res) => {
    try {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        //save new user
        await newUser.save();
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json("Wrong credentials!");

        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) return res.status(400).json("Wrong credentials!");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        return res.status(200).json({ others, accessToken });

    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;


