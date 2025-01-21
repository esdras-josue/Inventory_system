const express = require("express");
const database = require("../database/connection");
const authMiddleware = require("../middlewares/authMiddlewares");
const bcrypt = require('bcryptjs');
const saltRounds = 10;


const router = express.Router();

router.get("/", authMiddleware, (req, res) =>{
    const query = `SELECT users.id,users.name,users.username, users.email, roles.name as role,users.status
    FROM users
    JOIN roles ON users.role_id = roles.id`;

    database.query(query, (err, results)=>{
        if(err){
           return res.status(500).json({error:"Error getting users", details: err.message});
        }

        res.status(200).json(results);
        
    });
});

router.get("/:id", authMiddleware,(req, res) =>{
    const userId = req.params.id;
    const query = `SELECT name, username, email, role_id, status
                   FROM users 
                   WHERE id = ?`;

    database.query(query, [userId], (err, results) =>{
        if(err){
            return res.status(500).json({error:"Error getting user", details: err.message});
        }

        if(results.length ===0){
            return res.status(404).json({error:"User not found"});   
        }

        res.status(200).json(results[0]);
    });

});

router.post("/", authMiddleware, (req, res) =>{
    const {name, email ,username, password, role_id} = req.body;
    
    if(!name || !email || !username || !password || !role_id){
        return res.status(400).json({Error: "All fields are required"});
    }
    
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password", details: err.message });
        }
    
    const query = `INSERT INTO users (name, email ,username, password , role_id) VALUES (?,?,?,?,?)`;
    database.query(query, [name, email ,username, hashedPassword ,role_id], (err, results) =>{
        if(err){
            return res.status(500).json({error:"Error creatiing user", details: err.message});
        }

        res.status(201).json({message:"User created successfully", userId: results.insertId});

        });
    });
});

router.put("/:id", authMiddleware, (req, res)=>{
    const id = req.params.id;
    const {name, email, username, password, role_id} = req.body;

    if(!name || !email || !username || !password || !role_id){
        res.status(400).json({Error: "All field are require!"});
    }

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password", details: err.message });
        }

    const query = `UPDATE users 
                   SET name = ?, email = ?, username = ?, password = ?, role_id = ?
                   WHERE id = ?
                  `;

    database.query(query,[name, email, username, password, role_id, id], (err, results) =>{
        if(err){
            return res.status(500).json({error: "can not Update user", details: err.message});
        }

        if (results.affectedRows === 0){
            return res.status(404).json({error: 'User not found'});
        }

        res.status(201).json({message: "User updated seccesfully", userId: results.userId});

        });
    });   
});

router.delete("/:id", authMiddleware, (req, res) =>{
    const id = req.params.id;
    const query = `DELETE FROM users WHERE id = ?`;

    database.query(query, [id], (err, results)=>{
        if(err){
            return res.status(500).json({error: "Error deactivating user",  details: err.message});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({error: 'User not found'});
        }

        res.status(201).json({message: "User deactivated succesfully"});
    });
});

module.exports = router;