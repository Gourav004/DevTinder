const express = require("express");
const profileRouter = express.Router();
const user     = require("../Models/user");         
const userAuth = require("../Middlewares/auth"); 
const jwt = require("jsonwebtoken")
const {validateProfileEditData , validatePasswordInput} = require("../Utils/validation");
const bcrypt = require("bcrypt");

//access the profile
profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try {
        // console.log("WY")
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            res.status(404).send("Profile Edit data me dikkat hai.");
        }
        else {
            //updating the loggedInUser info
            const loggedInUser = req.user;

            Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

            await loggedInUser.save();

            // console.log(loggedInUser);
            res.status(200).json(
                {
                    message: `${loggedInUser.firstName} Profile updated successfully`,
                    data: loggedInUser,
                }
                
            ); 
        }
              
    
    }
    catch (err) {
        res.status(404).send("ERROR " + err.message);
    }
    
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        if (!validatePasswordInput(req)) {
            res.status(404).send("Password is not strong enough");
        }
        else {
            req.user.password = req.body.password;
            res.status(200).send("Password chnaged successfully");
            req.user.password = await bcrypt.hash(req.user.password, 10);
            await req.user.save();
        }
    }
    catch (err) {
        res.status(404).send("ERROR " + err.message);
    }

})

module.exports = profileRouter;
