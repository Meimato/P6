const express = require("express");
const router = express.Router();

const controllerSauce = require("../controllers/sauce");

router.post("/", controllerSauce.createSauce);
router.put("/:id", controllerSauce.modifySauce);
router.delete("/:id", controllerSauce.deleteSauce);
router.get("/:id", controllerSauce.getOneSauce);
router.get("/", controllerSauce.getAllSauces);

module.exports = router;
