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
        .then(user => {
            if (user) {
                res.status(200).json({
                    success: true,
                    user
                });
            } else {
                res.status(404).json({ 
                    message: "The user with the specified ID does not exist."
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: "The user information could not be retrieved.",
            });
        });
}

function getAllUsers(req, res) {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ 
                error: "The users information could not be retrieved." 
            });
        });
}

function createNewUser(req, res) {
    if (!req.body.name || !req.body.user) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        });
    } else {
        const newUser = {
            name: req.body.name,
            bio: req.body.bio,
        }
        
        db.insert(newUser)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the user to the database"
            });
        });
    }
}
    
function deleteUserById(req, res) {
    db.remove(req.params.id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ 
                    message: "The user with the specified ID does not exist." 
                });
            }
        })
        .catch(err => {
            res.status(500).json({ 
                error: "The user could not be removed" 
            });
        });
}

function modifyUserById(req, res) {
    const { id } = req.params;
    const changes = req.body;

    if (!changes.name || !changes.body) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        });
    } else {        
        db.update(id, changes)
        .then(count => {
            if (count) {
                res.status(200).json(count);
            } else {
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                });
            }
        })
        .catch(err => {
            res.status(500).json({ 
                error: "The user information could not be modified."
            });
        });
    }
}

function handleDefaultReq(req, res) {
    res.json("Hello world");
}

server.listen(process.env.PORT || 3000, () => {
    console.log("listening on port " + (process.env.PORT || 3000));
})
