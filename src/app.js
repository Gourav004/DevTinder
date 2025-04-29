const express = require('express');
const app = express();
const connectDB = require("./Config/database")
const User = require("./Models/user");


app.use(express.json()); 

//creating a new user
app.post("/signup", async (req, res) => {

     //Creating instance of User Model
    const user = new User(req.body);
    try {
        await user.save(); // Saving the user to the database
        res.send("User Created Successfully!!!");
    }
    catch(err) {
        res.status(500).send("Error in Creating User!!!");
    }


});

//Get one user by email
app.get("/user", async (req, res) => {
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




