const express = require("express")
const app = express();
const { ConnectDB } = require("./DataBase/Database.js")
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
ConnectDB();

const { Server } = require("socket.io");
const { createServer } = require("http");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: "http://localhost:5173",
    },
});
io.on("connection", (socket) => {
    console.log(socket.id, "Connected");
    socket.emit("Welcome", "Welcome Everybody");
    socket.on("Welcome", ({ name }) => {
        console.log(`${name} has Joined the Server`);
        socket.broadcast.emit("Welcome", `${name} has Joined the Server`);


    });

    socket.on("disconnect", () => {
        console.log(socket.id, "Disconnected");
        socket.broadcast.emit("Welcome", `${socket.id} has Left the Server`);
    });

});






const AuthRoutes = require("./Router/Auth_Routes.js")
const AssingmentRoutes = require("./Router/Assingment_Routes.js");
const User_Model = require("./Models/User_Model.js");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use("/Auth", AuthRoutes)
app.use("/Assign", AssingmentRoutes)


app.get('/x/:id', async (req, res) => {
    try {
        const users = await User_Model.findById(req.params.id);
        res.send(users)
    } catch (error) {
        console.log(error);

    }
})

server.listen(3000, () => {
    console.log("Server is Running at Port 3000");

})