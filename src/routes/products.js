const express = require('express');
const database = require('../database/connection');
const authMiddleware = require("../middlewares/authMiddlewares");


const router = express.Router();

router.get("/", authMiddleware, (req, res)=>{
    const query = 
    `SELECT products.id, products.name, products.price, products.stock,categories.name as category, products.status
    FROM products
    JOIN categories ON products.category_id = categories.id`;

    database.query(query, (err, results) =>{
        if(err){
            return res.status(500).json({error: "Error getting products", details: err.message});
        }

        res.status(200).json(results);
    });
});

router.get("/:id", authMiddleware,(req, res) =>{
    const productId = req.params.id;
    const query = 
    `SELECT id ,name, price, stock, status
    FROM products 
    WHERE id = ?`;

    database.query(query, [productId], (err, results) =>{
        if(err){
            return res.status(404).json({error: "Error getting product", details: err.message})
        }

        if(results.length === 0){
            return res.status(404).json({error:"product not found"});   
        }
        res.status(200).json(results[0]);

    });
});

router.post("/", authMiddleware,(req, res) => {
    const {name, price, stock, category_id, status} = req.body;
    
    if(!name || !price || !stock || !category_id || !status){
        return res.status(400).json({error: "All fields are required"});
    }
    
    const query = `INSERT into products(name, price, stock, category_id, status) VALUES(?,?,?,?,?)`;
    database.query(query, [name, price, stock, category_id, status], (err, results) =>{
        if(err){
           return  res.status(500).json({Error: "Error adding products", details: err.message});
        }

        res.status(200).json({message: "product created sucessfuly" ,productoId: results.insertId});
    });
});

router.put("/:id", authMiddleware,(req, res) =>{
    const productId = req.params.id;
    const {name, price, stock, category_id, status} = req.body;

    if(!name || !price || ! stock || ! category_id || ! status){
        return res.status(400).json({Error: "All fields are required"})
    }

    const query = `UPDATE products SET name = ?, price = ?, stock = ?, category_id = ?, status = ? WHERE id = ?`
    database.query(query, [name,price, stock, category_id, status, productId], (err, results) =>{
        if(err){
            return res.status(500).json({error: "cannot updated product", details: err.message})
        }

        if(results.affectedRows === 0){
            return res.status(404).json({error: "Product not found"})
        }

        res.status(200).json({message: "product updated succesfully"});
    });  
});

router.delete("/:id", authMiddleware, (req, res) =>{
    const productId = req.params.id;
    const query = `DELETE FROM products WHERE id = ?`;

    database.query(query, [productId], (err, results) =>{
        if(err){
            return res.status(500).json({error: "can not eliminate products", details: err.message})
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error: "Product not found"});
        }

        res.status(200).json({message: "Product eliminated succesfully"});
    });
});

module.exports = router;