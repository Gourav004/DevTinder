const express = require('express');
const app = express();
const connectDB = require("./Config/database")
const User = require("./Models/user");


app.use(express.json()); 

app.post("/signup", async (req, res) => {

     //Creating instance of User Model
    const user = new User(req.body);
    //Creating a new instance of User Model
    
    try {
        await user.save(); // Saving the user to the database
        res.send("User Created Successfully!!!");
    }
    catch(err) {
        res.status(500).send("Error in Creating User!!!");
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




