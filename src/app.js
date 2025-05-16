// const express = require('express');
const express = require("express");
const validateSignUpData = require("./Utils/validation")
const app = express();
const connectDB = require("./Config/database")
const User = require("./Models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const userAuth = require("./Middlewares/auth");

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

//access the profile
app.get("/profile",userAuth, async (req, res) => {
    try {
        console.log("WY")
        const user = req.user;
       if (!user) {
           res.send("No user found");
       }

        res.send("Reading Cookies");
    }
   catch (err) {
       res.status(404).send("Invalid Token");
    }
});

//sending connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    console.log("Sending connectionr request");
    res.send( user.firstName + " sent the connection request!!!");
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

// const express = require("express");
// const app = express();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());
// app.get("/", async function (req, res) {
//     //encrypting and decrypting the data
//     // res.cookie("name", "Harsh");
//     // const EncryptPass= await  bcrypt.hash("password", 10);
//     // console.log(EncryptPass);

//     // const DecryptPass = await bcrypt.compare("password", EncryptPass);
//     // console.log(DecryptPass);
    
//     // res.send("Done cokkie");

//     let token = jwt.sign({ email: "harsh@example.com" }, "secret");
//     const cookie = res.cookie("token", token);
//     console.log(token);
//     console.log(cookie);
//     res.send("Token made")
    

// })
// app.get("/read", function (req, res) {
//     let data = jwt.verify(req.cookies.token, "secret");
//     console.log(data);
//     res.send("TOken read")
// })

// app.listen(3000);


