const express = require ('express');
const database = require('./src/database/connection'); 
const authRoutes = require('./src/routes/auth');
const jwt = require("jsonwebtoken");   

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
})

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
