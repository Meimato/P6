const express = require("express");
const routerSauce = express.Router();

const controllerSauce = require("../controllers/sauce");

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

routerSauce.get("/", auth, controllerSauce.getAllSauces);
routerSauce.get("/:id", auth, controllerSauce.getOneSauce);
routerSauce.put("/:id", auth, multer, controllerSauce.modifySauce);
routerSauce.post("/", auth, multer, controllerSauce.createSauce);
routerSauce.delete("/:id", auth, controllerSauce.deleteSauce);

routerSauce.delete("/", auth, controllerSauce.deleteAllSauces);

module.exports = routerSauce;