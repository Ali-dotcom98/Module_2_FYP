const express = require("express")
const app = express();
const { ConnectDB } = require("./DataBase/Database.js")
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
ConnectDB();

const AuthRoutes = require("./Router/Auth_Routes.js")
const AssingmentRoutes = require("./Router/Assingment_Routes.js")
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use("/Auth", AuthRoutes)
app.use("/Assign", AssingmentRoutes)

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