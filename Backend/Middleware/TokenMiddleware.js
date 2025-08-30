const jwt = require("jsonwebtoken");
const SecretKey = process.env.SECRET_KEY;


const GenerateToken = (Payload) => {
    const token = jwt.sign(Payload, SecretKey, { "expiresIn": "10hr" })
    return token;
}
const VerifyToken = (token) => {
    return jwt.verify(token, SecretKey)
}

const Protect = (req, res, next) => {


    let token = req.headers.authorization?.split(" ")[1];



    if (!token) {
        return res.status(401).json({ Message: "Unauthorized, No Token Provided" });
    }

    try {
        const decoded = VerifyToken(token)

        const user = decoded.User;

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ Message: error.message });
    }
};

module.exports = { GenerateToken, VerifyToken, Protect }