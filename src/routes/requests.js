const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const userAuth = require("../Middlewares/auth");
const connectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //Validation to the :status api
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type " + status });
        }

        
       
        const ConnectionRequest = new connectionRequest({
            fromUserId,
            toUserId,
            status,
            
        });


        //if there is an exesting connectionRequest (dobara na bhej ske , na hi wha se wo bnda bhej ske)
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res
                .status(400)
                .send({ message: " Connection Request already Existed" });
        }

        //check kr rha hu ki jisko req bhej rha hai user wo DB me exist krta hai ki nhi

        const presentInDB = await User.findById(toUserId);
        if (!presentInDB) {
            return res
                .status(400)
                .json({ message: "User not existed" });
        }
        //user apne aap ko request nhi bhej skta



        const data = await ConnectionRequest.save();
        res.json({
            message: "COnnectionequest Sent Successfully",
            data,
        })
    }
    catch (err) {
        res.status(404).send("ERROR " + err.message);
    }
});
   
//to review the request
// requestRouter.post("/request/review/:status/:requestId",userAuth, async (req, res) => {
//       try {
//         const loggedInUser = req.user;
//         const { status, requestId } = req.params;
  
//         const allowedStatus = ["accepted", "rejected"];
//         if (!allowedStatus.includes(status)) {
//           return res.status(400).json({ messaage: "Status not allowed!" });
//         }
  
//         const ConnectionRequest = await connectionRequest.findOne({
//           _id: requestId,
//           toUserId: loggedInUser._id,
//           status: "interested",
//         }).populate("fromUserId", ["firstName", "lastName"]);


//         if (!ConnectionRequest) {
//           return res
//             .status(404)
//             .json({ message: "Connection request not found" });
//         }
  
//         ConnectionRequest.status = status;
  
//         const data = await ConnectionRequest.save();
  
//         res.json({ message: "Connection request " + status, data });
//       } catch (err) {
//         res.status(400).send("ERROR: " + err.message);
//       }
//     }
//   );
  
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
        //validate the status
    // loggedInUser = LoggedInUser
    // status = interested
    //requestId should be valid

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid request id!"}  )
    }

    const ConnectionRequest = await connectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status : "interested",
    })

    if (!ConnectionRequest) {
      return res
        .status(404)
        .json({ message: "COnnection Request Not found" });
    }
    ConnectionRequest.status = status;
    const data = await ConnectionRequest.save();
    res.json({ message: "Connection Request Accepted" });
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message);

    
  }
});
module.exports = requestRouter;
