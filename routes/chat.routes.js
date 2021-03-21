const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const { getAllChatRooms, createChatRoom} = require("../controllers/chat/index");
const { catchErrors } = require("../handlers/errorHandlers");

const router = Router();

router.get("/", auth, catchErrors(getAllChatRooms));
router.post("/", auth, catchErrors(createChatRoom));

module.exports = router;
