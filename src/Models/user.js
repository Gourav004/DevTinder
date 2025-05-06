const mongoose = require("mongoose"); // Importing mongoose to interact with MongoDB
const validator = require("validator"); // Validator for string validations

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4, // Minimum length for first name
      maxlength: 20, // Maximum length for first name
    },
    lastName: {
      type: String,
      validate(value) {
        if (value.length > 20) {
          throw new Error("Last name should be 20 characters or less");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email uniqueness in the DB
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18, // Minimum allowed age
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender value");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL format");
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! This is the default about.",
      maxlength: 200,
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Skills should be less than or equal to 5",
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel; // Exporting the user model to use in other files.
