const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  getAllChatRooms,
  createChatRoom,
  getChatRoom,
  deleteChatRoom,
} = require("../controllers/chat-room/index");
const {
  getAllChats,
  getChat,
  createChat,
  deleteChat,
  like,
} = require("../controllers/chat/index");
const { catchErrors } = require("../handlers/errorHandlers");

const router = Router();

router.post("/chatroom", getChatRoom);
router.delete("/delete/:id", deleteChatRoom);
router.get("/:userId", getAllChatRooms);
router.get("/:id/chats/:chatId", getChat);
router.get("/:id/chats", getAllChats);
router.post("/item/:chatId", deleteChat);
router.post("/:id/chats", createChat);
router.post("/", createChatRoom);
router.put("/like/:id", like);

module.exports = router;
