const express = require("express");
const routerUser = express.Router();

const controllerUser = require("../controllers/user");

routerUser.post('/signup', controllerUser.signup);
routerUser.post("/login", controllerUser.login);

module.exports = routerUser;
