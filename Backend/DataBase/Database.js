const mongoose = require("mongoose");
const UserModel = require("../Models/User_Model")
const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Collaboration')
        console.log("Database is Connected");

    } catch (error) {
        console.log(error);

    }
}

module.exports = { ConnectDB };