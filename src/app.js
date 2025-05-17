// const express = require('express');
const express = require("express");
const app = express();
const connectDB = require("./Config/database")
const cookieParser = require("cookie-parser")
const validateSignUpData = require("./Utils/validation")

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");


app.use(express.json()); 
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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


