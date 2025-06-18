const jwt = require("jsonwebtoken");
const User = require("../Models/user")
const userAuth = async (req, res, next)=> {
    
    try { //read the token from the request
        const { token }  = req.cookies;
        // console.log( token)
        
        const newToken = token;

        //validate the token
        const decodedObj = await jwt.verify(newToken, "DEV@TINDER$790");
     
        //find the user
        const { _id } = decodedObj;
        const user = await User.findOne({ _id });
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