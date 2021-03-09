const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        if (bearer) {
            const bearerToken = bearer.split(" ");
            const token = bearerToken[1];
            jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
                if (err || bearerToken[0]!=="Bearer") {
                    return res.sendStatus(401);
                }
                req.userDataFromJWT = decoded;
                next();
            });
        }
        else {
            return res.sendStatus(401);
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error");
    }
}