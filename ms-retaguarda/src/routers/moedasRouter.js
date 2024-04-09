const express = require("express");
const moedasController = require("../controllers/moedasController");

const router = express.Router();
router.post("/", moedasController.create);
router.get("/", moedasController.read);
router.get("/:id", moedasController.readOne);
router.patch("/:id", moedasController.update);
router.delete("/:id", moedasController.delete);

module.exports = router;
