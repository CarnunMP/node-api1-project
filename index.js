// implement your API here
const express = require("express");
const cors = require("cors");
const db = require("./data/db");

const server = express();

server.use(express.json());
server.use(cors());

server.get("/api/users/:id", getUserById);
server.get("/api/users", getAllUsers);
server.post("/api/users", createNewUser);
server.get("*", handleDefaultReq);

function getUserById(req, res) {
    db.findById(req.params.id)
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        })
}

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

function createNewUser(req, res) {
    const newUser = {
        name: req.body.name,
        bio: req.body.bio || "",
    }

    db.insert(newUser)
        .then(data => {
            console.log("id of new user: " + data.id);
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
