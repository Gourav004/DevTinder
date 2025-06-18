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
const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    
    return isEditAllowed;
}

const validatePasswordInput = (req) => {
    const password = req.body.password;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const passValid=  regex.test(password);

    return passValid;
}

module.exports = { validateSignUpData , validateProfileEditData , validatePasswordInput};