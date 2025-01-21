const express = require ('express');
const cors = require('cors');
const database = require('./src/database/connection'); 
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const productRoutes = require('./src/routes/products');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');   

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);


const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
