// implement your API here
const express = require("express");
const cors = require("cors");
const db = require("./data/db");

const server = express();

server.use(express.json());
server.use(cors());

server.get("/api/users", getAllUsers);
server.get("*", handleDefaultReq);

function getAllUsers(req, res) {
    db.find()
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        })
}

function handleDefaultReq(req, res) {
    res.json("Hello world");
}

server.listen(process.env.PORT || 3000, () => {
    console.log("listening on port " + (process.env.PORT || 3000));
})
