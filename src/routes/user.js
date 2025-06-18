const express = require("express");
const userRouter = express.Router();
const userAuth = require("../Middlewares/auth");
const connectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user")



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
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    
    try {
        const loggedInUser = req.user;

        const connections = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", "firstName lastName")
            .populate("toUserId", "firstName lastName") 
        
        const data = connections.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            else {
                return row.fromUserId;
            }
        }
        );
        if (!connections) {
            res.status(200).json({ message: "You have no connections right now" });
        }
        else {
            res
                .status(200)
                .json({data});
        }
       

    }
    catch (err) {
        res.status(404).json({message: "Unable to find the connections"})
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
       
        // user should see all the cards except
        // 1. his own card
        // 2. his connections
        // 3. ignored people
        // 4. already sent the connection request

        const loggedInUser = req.user;

        //find all the connection requests (sent + received)
        //these should not be in feed
        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
            // .populate("fromUserId", "firstName")
            // .populate("toUserId", "firstName")
            
            //loop thorugh all these user
            const hideUsersFromFeed = new Set();
            connectionRequests.forEach(req => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            })
         
        const users = await User.find({
           $and:  [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: {$ne : loggedInUser._id}}
            ],
        })
        res.send(users);
        
    }

    


    catch (err) {
        res.status(400).json({ message: err.message });
    }
})
module.exports = userRouter;