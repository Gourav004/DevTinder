const express = require('express');


const app = express();

app.use("/test",(req, res) => {
    res.send("Namaste form the server!");
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});