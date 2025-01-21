/**
 * Archivo de rutas para la autenticacion.
 * Contiene el endpoint para reiniciar y generar un token JWT
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const database = require("../database/connection");
const bcrypt = require('bcryptjs');
const router = express.Router();
// Clave secreta para firmar los tokens JWT
const SECRET_KEY = process.env.JWT_SECRETE_KEY || "my_secret_key";


/**
 * LogIn
 * Metodo: POST
 * Ruta: /api/auth/login
 * Verifica las credenciales proporcionadas
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
  }

  const query = `SELECT id, username, password, role_id FROM users WHERE username = ? AND password = ? AND status = 'active'`;
  database.query(query, [username, password], (err, results) => {
      if (err) {
          return res.status(500).json({ error: "Database error", details: err.message });
      }

      if (results.length === 0) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];
      
      // Compara la contraseña proporcionada con la contraseña encriptada en la base de datos
      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              return res.status(500).json({ error: "Error comparing password", details: err.message });
          }

          if (!isMatch) {
              return res.status(401).json({ error: "Invalid credentials" });
          }
        
          // Generar JWT si las credenciales son correctas
          const token = jwt.sign(
              { userId: user.id, roleId: user.role_id, userName: user.username },
              SECRET_KEY,
              { expiresIn: "1h" }
          );

          res.status(200).json({ message: "Authentication successful", token });
      });
  });
});


module.exports = router;