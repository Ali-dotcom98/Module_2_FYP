const express = require("express")

const app = express();

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