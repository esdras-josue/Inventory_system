const jwt = require('jsonwebtoken');

// clave secreta para verificar y firmar token
const my_secret_key = "my_secret_key";

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization']; // Extraer el encabezado de autorizacion

    if(!authHeader){
        return res.status(401).json({error: 'Acceso denegado. Se requiere un token'}); 
    }
    // Extraer el token del encabezado (formato: Bearer <token>)
    const token = authHeader.split(' ')[1];

    jwt.verify(token, my_secret_key, (err, user) =>{
        if(err){
            return res.status(401).json({error: 'Token invalido o expirado'});
        }
        req.user = user; // informacion del usuario al request
        next();
    });
}

module.exports = authMiddleware;

