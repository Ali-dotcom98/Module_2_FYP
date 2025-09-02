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

const onlineUsers = {};

io.on("connection", (socket) => {
    console.log(socket.id, "Connected");

    socket.on("joinGroup", async ({ assignmentId, User }) => {

        onlineUsers[User._id] = socket.id;
        io.emit("updateOnlineStatus", Object.keys(onlineUsers));


        const assignment = await Assingment_Model.findById(assignmentId);
        if (!assignment) return;


        let groupIndex = null;
        assignment.settings.groupSettings.groupsDetail.forEach((group, idx) => {
            if (group.some(student => student._id.toString() === User._id)) {
                groupIndex = idx;
            }
        });

        if (groupIndex === null) return;

        const groupName = `${assignmentId}-group-${groupIndex}`;
        socket.join(groupName);

        // Tell everyone else that user joined
        socket.to(groupName).emit("userJoined", {
            name: User.name,
            groupId: groupName
        });

        // Also tell the joining user their group
        socket.emit("userJoined", {
            name: User.name,
            groupId: groupName,
            id: User._id
        });

        console.log(`User ${User.name} joined room ${groupName}`);

        const room = io.sockets.adapter.rooms.get(groupName);
        if (room) {
            console.log("Users in room:", Array.from(room));
        } else {
            console.log("Room is empty or does not exist");
        }
    });

    socket.on("sendMessage", ({ SocketGroup, User, message }) => {
        io.to(SocketGroup).emit("receiveMessage", User, message);
    });

    socket.on("Typing", (SocketGroup, User, Flag) => {

        socket.to(SocketGroup).emit("userTyping", User, Flag);
    });

    socket.on("TypingFinish", (SocketGroup, User) => {

        socket.to(SocketGroup).emit("userTyping", User, false);
    });

    socket.on("Answering", (User, SocketGroup, currentIndex, answer, Flag) => {
        socket.to(SocketGroup).emit("Answering", User, currentIndex, answer, Flag)
    })



    socket.on("disconnect", () => {
        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                break;
            }
        }
        io.emit("updateOnlineStatus", Object.keys(onlineUsers));
    });
});






const AuthRoutes = require("./Router/Auth_Routes.js")
const AssingmentRoutes = require("./Router/Assingment_Routes.js");
const User_Model = require("./Models/User_Model.js");
const PartialSubmission = require("./Router/PartialSubmission_Route.js");
const Assingment_Model = require("./Models/Assingment_Model.js");
const { log } = require("console");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use("/Auth", AuthRoutes)
app.use("/Assign", AssingmentRoutes)
app.use("/Partial", PartialSubmission)


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