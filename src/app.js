const express = require('express');
const app = express();
const adminAuth = require("../src/Middlewares/auth")

// app.get("/user/:userID", (req, res) => {
//     console.log(req.params);
//     res.send("ID is " + req.params.userID);
//     // res.send("Its working fine");
// });
// app.use(
//     "/user",
//     (req, res , next) => {
//     console.log("Sending Request 1!!!");
//     next();
//     // res.send("Its working fine");
        

// },
//     (req, res) => {
//      console.log("Sending Request 2!!!");
//      res.send("Its working fine 2");
// })

// app.get("/user", (req, res) => {
//     console.log("Handler 1!!!");
//     res.send("Response 1!!!");
//     // res.send("Its working fine");
// });
// app.get("/user", (req, res) => {
//     console.log("Handler 2!!!");
//     res.send("Response 2!!!");
//     // res.send("Its working fine");
// });



//AUth using middleware

app.use("/admin", adminAuth);


app.get( "/admin/getAllData", (req, res) => {
    res.send("All Data is here!!!");
})
app.get( "/user", (req, res) => {
    res.send("All Data is here!!!");
})
    
app.get( "/admin/deleteUser", (req, res) => {
    res.send("User Deleted!!!");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
