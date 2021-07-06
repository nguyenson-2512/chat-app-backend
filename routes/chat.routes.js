const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const { getAllChatRooms, createChatRoom } = require("../controllers/chat-room/index")
const { getAllChats, getChat, createChat, deleteChat} = require("../controllers/chat/index");
const { catchErrors } = require("../handlers/errorHandlers");

const router = Router();

router.get("/:userId", getAllChatRooms);
router.post("/", catchErrors(createChatRoom));
router.get("/:id/chats", getAllChats);
router.get("/:id/chats/:chatId", getChat);
router.post("/:id/chats", createChat);
router.post("/:id/chats/:chatId", deleteChat);

module.exports = router;
