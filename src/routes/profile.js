const express = require("express");
const profileRouter = express.Router();
const User     = require("../Models/user");          // ..
const userAuth = require("../Middlewares/auth"); 
const jwt = require("jsonwebtoken")




//access the profile
profileRouter.get("/profile",userAuth, async (req, res) => {
    try {
        console.log("WY")
        const user = req.user;
       if (!user) {
           res.send("No user found");
       }

        res.send(user);
    }
   catch (err) {
       res.status(404).send("Invalid Token");
    }
});

module.exports = profileRouter;
