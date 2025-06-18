const express = require("express");
const userRouter = express.Router();
const userAuth = require("../Middlewares/auth");
const connectionRequest = require("../Models/connectionRequest");



//Get all the pending connection requests for the loggedInUser nothing more nothing less
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);

        if (requests == null) {
            return res.send("No requests");
        }
        res.status(200).send(requests);
    }
    catch (err) {
        return res.status(400).send("ERROR " + err.message);
    }
} )
module.exports = userRouter;