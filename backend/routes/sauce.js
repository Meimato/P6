const express = require("express");
const routerSauce = express.Router();

const controllerSauce = require("../controllers/sauce");

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

routerSauce.post("/", auth, multer, controllerSauce.createSauce);
routerSauce.put("/:id", auth, multer, controllerSauce.modifySauce);
routerSauce.delete("/:id", auth, controllerSauce.deleteSauce);
routerSauce.get("/:id", auth, controllerSauce.getOneSauce);
routerSauce.get("/", auth, controllerSauce.getAllSauces);

routerSauce.delete("/", controllerSauce.deleteAllSauces);

module.exports = routerSauce;
