const express = require('express');
const app = express();

// app.get("/user/:userID", (req, res) => {
//     console.log(req.params);
//     res.send("ID is " + req.params.userID);
//     // res.send("Its working fine");
// });
app.use(
    "/user",
    (req, res , next) => {
    console.log("Sending Request 1!!!");
    next();
    // res.send("Its working fine");
        

},
    (req, res) => {
     console.log("Sending Request 2!!!");
     res.send("Its working fine 2");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
