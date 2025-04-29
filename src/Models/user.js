const mongoose = require("mongoose"); // Importing mongoose to interact with MongoDB

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            validate(value) { 
                if (value.length > 20) {
                    throw new Error("First name should be less than 20 characters");
                }
            }
        },
        lastName: {
            type: String,
             validate(value) { 
                if (value.length > 20) {
                    throw new Error("First name should be less than 20 characters");
                }
            }
            

        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures that the email is unique in the database
            lowercase: true, // Converts the email to lowercase before saving
            trim: true, // Removes any leading or trailing whitespace

        },
        password: {
            type: String,
            required: true,

        },
        age: {
            type: Number,
            min: 18, // Minimum age is 18

        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Invalid gender value");
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://www.w3schools.com/howto/img_avatar.png", // Default photo URL
        },
        about: {
            type: String,
            default: "Hey there! This is the default about.",
            maxlength: 200, // Maximum length of the about string
            trim: true, // Removes any leading or trailing whitespace
        },
        skills: {
            type: [String], // Array of strings for skills
            default: [], // Default value is an empty array
        }
        
     
    
    },
        {
            timestamps:true
        }
   
);

const userModel = mongoose.model("User" , userSchema);
module.exports = userModel;  // Exporting the userModel to use in other files.
// This model is used to create a new user in the database. The userSchema defines the structure of the user document in the MongoDB database. The userModel is then used to interact with the database, such as creating, reading, updating, and deleting user documents.