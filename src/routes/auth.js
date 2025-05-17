const express = require("express");
const authRouter = express.Router();
 const validateSignUpData = require("../Utils/validation");  // ← go up one level
 const User              = require("../Models/user");        // ← go up one level
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
    //valudation of data
    validateSignUpData(req);

        //Encrypt the password
        const {firstName,lastName,email, password } = req.body;
        const passwordHash =await bcrypt.hash(password, 10);


     //Creating instance of User Model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
    });
    
        await user.save(); // Saving the user to the database
        res.send("User Created Successfully!!!");
    }
    catch(err) {
        res.status(500).send(err.message); // Sending error message if user creation fails
    }


});

//login the user
authRouter.post("/login", async (req, res) => {
    
    try {
        const { email, password } = req.body; //extracting email and password from the request body
        //finding the user by email
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("Invalid Credentials"); //throwing error if user not found
        }
        //comparing the password with the hashed password in the DB
        const isPassValid = await user.validatePassWord(password);
        if (isPassValid) {
            
            //create a JWT token
            const token = await user.getJWT();
           

            //add the token to the cookie and send the response back to the user.
            res.cookie("token", token);

            res.send("Login Successfully!!!") //sending success message if password is valid
        }
        else {
            throw new Error("Invalid Credentials"); //throwing error if password is not valid
        }

    }
    catch (err) {
        res.status(500).send("ERROR " + err.message); // Sending error message if user creation fails
    }

});






module.exports = authRouter;