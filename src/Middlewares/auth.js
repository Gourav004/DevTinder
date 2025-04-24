 const adminAuth  =  (req, res, next) => {
    const token = "xyz"
    const isAuthorised = token === "xyz";
    if(isAuthorised) {
        next();
    } else {
        res.status(401).send("Unauthorized!!!")
    };
}

module.exports = adminAuth;