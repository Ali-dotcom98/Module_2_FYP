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

    socket.on("Save", async (SocketGroup, User, currentIndex, AssingmentId, PartialSubmission) => {
        console.log("AssingmentId", AssingmentId);
        console.log("PartialSubmission", PartialSubmission);
        socket.to(SocketGroup).emit("SaveBy", User, currentIndex)
        const SubmitAssingment = await PartialSubmission_Model.findOne({ assignmentId: AssingmentId, _id: PartialSubmission._id })
        console.log("SubmitAssingment", SubmitAssingment);

        Object.assign(SubmitAssingment, PartialSubmission);
        SubmitAssingment.save();
    })

    socket.on("Reset", async (SocketGroup, currentIndex, AssingmentId, UpdateSubmission) => {
        socket.to(SocketGroup).emit("Answering", null, currentIndex, "", false)
        const updated = await PartialSubmission_Model.findOneAndUpdate(
            { assignmentId: AssingmentId, _id: UpdateSubmission._id },
            { $set: { Questions: UpdateSubmission.Questions } },
            { new: true }
        );

    })


    socket.on("Votes", async (SocketGroup, User, currentIndex, AssingmentId, UpdateSubmission) => {
        socket.to(SocketGroup).emit("UpdateVotes", User, currentIndex)
        const update = await PartialSubmission_Model.findOneAndUpdate(
            { assignmentId: AssingmentId, _id: UpdateSubmission._id },
            { $set: { Questions: UpdateSubmission.Questions } },
            { new: true }
        )
    })

    socket.on("SubmissionVote", async (SocketGroup, User, AssingmentId, UpdateSubmission) => {
        console.log("UpdateSubmission.SubmissionVote", UpdateSubmission.SubmissionVote);
        console.log((UpdateSubmission.SubmissionVote).length)

        if ((UpdateSubmission.SubmissionVote).length >= 2) {
            socket.to(SocketGroup).emit("UpdateSubmissionVote", User, true)
            socket.emit("UpdateSubmissionVote", User, true)
            await PartialSubmission_Model.findOneAndUpdate(
                { assignmentId: AssingmentId, _id: UpdateSubmission._id },
                {
                    $set: {
                        SubmissionVote: UpdateSubmission.SubmissionVote,
                        status: "submitted"
                    }
                },
                { new: true }
            )
        }
        else {
            socket.to(SocketGroup).emit("UpdateSubmissionVote", User, false)
            socket.emit("UpdateSubmissionVote", User, false)
            await PartialSubmission_Model.findOneAndUpdate(
                { assignmentId: AssingmentId, _id: UpdateSubmission._id },
                { $set: { SubmissionVote: UpdateSubmission.SubmissionVote } },
                { new: true }
            )
        }
    })

    socket.on("ResetVotes", (SocketGroup) => {
        socket.to(SocketGroup).emit("ResetVotesArray")
        socket.emit("ResetVotesArray")
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
const PartialSubmission_Model = require("./Models/PartialSubmission_Model.js");
const path = require("path")
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use("/Auth", AuthRoutes)
app.use("/Assign", AssingmentRoutes)
app.use("/Partial", PartialSubmission)

app.use('/uploads', express.static(path.join(__dirname, 'uploads'),
    {
        setHeaders: (res, path) => {
            res.set("Access-Control-Allow-Origin", "http://localhost:5173")
        }
    }
));

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