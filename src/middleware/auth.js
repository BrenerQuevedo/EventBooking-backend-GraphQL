const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    
    if(!authorization){
        req.isAuth = false;
        return next();
        //return res.status(401).send({ error : "No token provided"})
    }

    const parts = authorization.split(' ')

    if(!parts.length === 2){
        req.isAuth = false;
        return next();
        //return res.status(401).send({ error : "Token error"})
    }

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)) {
        req.isAuth = false;
        return next();
        //return res.status(401).send({error: "Invalid Token Format"})
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) =>{
        //const a = jwt.decode(authorization)
        
        if(err) {
            req.isAuth = false;
            return next();
            //return res.status(401).send({error : 'Invalid Token'})
        }


        req.isAuth = true;
        req.id = decoded.id
        
        next(); 
    })
}