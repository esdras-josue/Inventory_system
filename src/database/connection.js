const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit: 0
});

connection.connect((err) =>{
    if(err){
        console.log("Error connecting to database:", err);
        return;
    }

    console.log('Connected to MySQL');
});

module.exports = connection;