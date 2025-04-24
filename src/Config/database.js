const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://gouravthakurpp:FyLCDrCrAaDNOvGC@namastenode.rz4mmvc.mongodb.net/devTinder");
};

module.exports = connectDB;