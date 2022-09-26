const express = require('express');
const app = express();
require('dotenv').config();
const connection = require('./database/db');
const cors = require('cors');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const cartRouter = require('./routes/cart');

//database connectio
connection();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});