const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        console.log(bearer);
        if (bearer) {
            const bearerToken = bearer.split(" ");
            const token = bearerToken[1];
            jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
                if (err || bearerToken[0] !== "Bearer") {
                    return res.status(401).send({message: "Please log in to access this page"});
                }
                req.userDataFromJWT = decoded;
                next();
            });
        }
        else {
            return res.status(401).send({message: "Unauthorized"});
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}