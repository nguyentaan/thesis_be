const express = require("express");
const router = express.Router();
const fileController = require("../controllers/product/fileController");

router.get("/", fileController.getAllUploadFile);

router.get("/:id", fileController.getUploadFileById);
router.post("/chunking_list", fileController.getAllChunklistFromSelectedFiles);

module.exports = router;

