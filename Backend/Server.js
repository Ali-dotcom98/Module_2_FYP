const express = require("express")
const app = express();
const { ConnectDB } = require("./DataBase/Database.js")
const dotenv = require("dotenv");
dotenv.config();
ConnectDB();

const AuthRoutes = require("./Router/Auth_Routes.js")

app.use(express.json())
app.use("/Auth", AuthRoutes)

app.get("/", (req, res) => {
    try {
        res.send("Hello World")

    } catch (error) {
        console.log(error);

    }
})


app.listen(3000, () => {
    console.log("Server is Running at Port 3000");

})