const express = require("express")
const bcrypt = require("bcryptjs")
const routes = express.Router();
const UserModel = require('../Models/User_Model');
const e = require("express");
const { GenerateToken, Protect } = require("../Middleware/TokenMiddleware");
routes.post("/Login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const isFilled = [email, password].every((item) => item != "");
        if (!isFilled)
            return res.send("NO empty Fields are Require")

        const isexist = await UserModel.findOne({ email });
        if (!isexist) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, isexist.password);
        if (!isPasswordMatch)
            return res.status(401).json({ message: "Invalid Email or Password" })

        const payload = { User: isexist };
        const token = GenerateToken(payload);
        return res.status(200).json({
            message: "Authorized",
            user: isexist,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

routes.post("/Register", async (req, res) => {
    try {
        const { name, email, password, status } = req.body;
        const isFilled = [name, email, password].every((item) => item != "");
        if (!isFilled)
            return res.send("NO empty filed is Required")
        const userexit = await UserModel.findOne({ email });
        if (userexit) {
            return res.status(400).json({ Message: "Email already Registered..." })
        }
        const salt = await bcrypt.genSalt(10);
        const EncryptedPass = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
            name: name,
            email: email,
            status: status,
            password: EncryptedPass
        })

        if (status == "Student") {
            const Instructor = await UserModel.findOne({ email: "A@gmail.com" })
            Instructor.students = [...Instructor.students, user._id];
            Instructor.save();
        }

        const Payload = { User: user };
        const token = GenerateToken(Payload)


        if (user) {
            return res.status(201).json({ Message: "User Added Successfully", user: user, token: token });
        } else {
            return res.status(500).json({ Message: "User creation failed" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

routes.get("/profile", Protect, async (req, res) => {
    try {
        const UserProfile = await UserModel.findById(req.user._id).select("-password");
        if (!UserProfile) {
            res.status(404).json({ message: "User Not Found" })
        }

        res.json({ user: UserProfile });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

routes.get("/Hello", (req, res) => {
    res.json({ message: "Hello Ali Welcome in Code Ascend   " })
})

module.exports = routes