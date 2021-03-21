const mongoose = require("mongoose");
// const ChatRoom = mongoose.model("ChatRoom");
const ChatRoom = require("../../models/ChatRoom.model")

exports.getAllChatRooms = async (req, res) => {
  const chatRooms = await ChatRoom.find({});
  res.json(chatRooms);
};

exports.createChatRoom = async (req, res) => {
  const { name } = req.body;
  // const nameRegex = /^[A-Za-z\s]+$/;
  // if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";
  const existedChatRoom = await ChatRoom.find({ name });
  if (existedChatRoom) {
    throw "Chatroom already exists";
  }

  const newChatRoom = new ChatRoom({ name });
  await newChatRoom.save();
  res.json({
    message: "ChatRoom created!",
  });
};
