const express = require("express");
const osController = require("../controllers/osController");
const router = express.Router();
const { authOmieMiddleware } = require("../middlewares/authOmieMiddleware");

router.post("/etapa-alterada", authOmieMiddleware, osController.etapaAlterada);

module.exports = router;
