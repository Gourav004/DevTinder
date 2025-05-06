const jwt = require("jsonwebtoken");
const user = require("../Models/user")
const userAuth = async (req, res, next) => {
    
    try{ //read the token from the request
        const { token } = req.cookies;
        if (!token) {
            res.send("TOken is not validddddd");
        }
     //validate the token
     const decodedObj = await jwt.verify(token, "DEV@TINDER$790");
     
     //find the user
    const { _id } = decodedObj;
    const user = User.findOne({ _id: user._id });
    if (!user) {
        throw new Error("User not found");
        }
        req.user = user;
        next();

    }
    catch (err) {
        res.status(404).send("ERROR: " + err.message);
    }
    
}

module.exports = userAuth;