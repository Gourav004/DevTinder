const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName.length || !lastName.length) {
        throw new Error("First name and last name are required");
    }
    else if(firstName.length<4 || firstName.length>20) {
        throw new Error("First name should be between 4 and 20 characters long");
    }
    
}

module.exports = validateSignUpData;