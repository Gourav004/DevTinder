const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
        }
    }
    
);

const userModel = mongoose.model("User" , userSchema);
module.exports = userModel;  // Exporting the userModel to use in other files.
// This model is used to create a new user in the database. The userSchema defines the structure of the user document in the MongoDB database. The userModel is then used to interact with the database, such as creating, reading, updating, and deleting user documents.