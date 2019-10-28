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
server.delete("/api/users/:id", deleteUserById);
server.put("/api/users/:id", modifyUserById);
server.get("*", handleDefaultReq);

function getUserById(req, res) {
    db.findById(req.params.id)
        .then(data => {
            console.log(data);
            if (data) {
                res.status(200).json({
                    success: true,
                    data
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Cannot find specified user.",
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                err,
            });
        });
}

function getAllUsers(req, res) {
    db.find()
        .then(data => {
            console.log(data);
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                err,
            });
        });
}

function createNewUser(req, res) {
    const newUser = {
        name: req.body.name,
        bio: req.body.bio || "",
    }

    db.insert(newUser)
        .then(data => {
            console.log("id of new user: " + data.id);
            res.status(201).json({
                success: true,
                data,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                err,
            });
        });
}

function deleteUserById(req, res) {
    db.remove(req.params.id)
        .then(deleted => {
            console.log(deleted);
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    success: false,
                    message: "Cannot find specified user.",
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                err,
            });
        });
}

function modifyUserById(req, res) {
    const { id } = req.params;
    const changes = req.body;

    db.update(id, changes)
        .then(count => {
            console.log(count)
            if (count) {
                res.status(200).json({
                    success: true,
                    count,
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "Cannot find specified user.",
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                err,
            });
        });
}

function handleDefaultReq(req, res) {
    res.json("Hello world");
}

server.listen(process.env.PORT || 3000, () => {
    console.log("listening on port " + (process.env.PORT || 3000));
})
