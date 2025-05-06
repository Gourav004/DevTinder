// const express = require('express');
const express = require("express");
const validateSignUpData = require("./Utils/validation")
const app = express();
const connectDB = require("./Config/database")
const User = require("./Models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./Middlewares/auth");

app.use(express.json()); 
app.use(cookieParser());
//creating a new user
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
    
    try {
        const { email, password } = req.body; //extracting email and password from the request body
        //finding the user by email
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("Invalid Credentials"); //throwing error if user not found
        }
        //comparing the password with the hashed password in the DB
        const isPassValid =await bcrypt.compare(password, user.password )
        if (isPassValid) {
            
            //create a JWT token
            const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790");
           

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

//access the profile
app.get("/profile",userAuth, async (req, res) => {
    try {
    //     const cookies = req.cookies; 

    // const { token } = cookies;
    // // validate my token 
    // const decodedMessage = await jwt.verify(token, "DEV@TINDER$790");
    
    
    // const { _id } = decodedMessage;
    

   
        const user = req.user;
       if (!user) {
           res.send("No user found");
       }

        res.send("Reading Cookies");
    }
   catch (err) {
       res.status(404).sedn("Invalid Token");
    }
});

//sending connection request
app.post("sendConnectionRequest" , async (req, res) => {
    console.log("Sending connectionr request");
    res.send("Request Sent!!!");
});

//Get one user by email
app.get("/user" ,userAuth, async (req, res) => {
    const userEmail = req.body.email;

    try {
        const user = await User.find({ email: userEmail });
        if (user.length === 0) {
            res.status(404).send("User not found");
        }
        res.send(user);
    }
    catch (err){
        res.status(400).send("Something went wrong");
    }

});

//Feed API - get all the users from the database.
app.get("/feed", async (req, res) => {
    // const userEmail = req.body.email;
    // const oneUser = await User.findOne({ email: userEmail });
    // res.send(oneUser);

    const users = await User.find({});
    if (!users) {
            res.status(404).send("User not found");
        }
    res.send(users);
})

//Delete a user by ID
app.delete("/user", async (req, res) => {
    const userId = req.body.userID;
    try {
        const dltUser = await User.findByIdAndDelete(userId);
        res.send("Deleted");
    }
    catch (err) {
        res.status(404).send("Dikkat ho gayi hai kuch");
    }

})

//Update a user data
app.patch("/user/:userID", async (req, res) => {
   const userID = req.params?.userID;  //extracting userID from the URL
    const data = req.body; //extracting data from the body of the request

//update data onlu some keys
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender" , "age"];
    const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
        throw new Error("Invalid update fields");
    }
    if (data.skills.length > 5) { 
        throw new Error("Skills should be less than 5");
    }
    
    try {
        await User.findByIdAndUpdate({ _id: userID }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("Updated Successfully!!!");
    }
    catch (err) {
        res.status(404).send("Dikkat ho gayi hai kuch" , err.message);
    }
});

connectDB()
    .then(() => {
        console.log("DB Connected Successfully!!!");
        app.listen(3000, () => {
        console.log('Server is running on port 3000');
    
});
    })
    .catch((err) => {
    console.log("Error in DB Connection!!!");
});




