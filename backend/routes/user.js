const express = require("express");
const routerUser = express.Router();

const controllerUser = require("../controllers/user");

routerUser.post('/signup', controllerUser.signup);
routerUser.post("/login", controllerUser.login);

// Utility routes
routerUser.get("/", controllerUser.getAllUsers);
routerUser.delete("/:id", controllerUser.deleteUser)

module.exports = routerUser;
