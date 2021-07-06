const mongoose = require("mongoose");
const ChatRoom = require("../../models/ChatRoom.model");
const User = require("../../models/User.model");

exports.getAllChatRooms = (req, res) => {
  const userId = req.params.userId
  // cr.find({users: {$ne: {user: mongoose.Types.ObjectId(userId)}}})
  ChatRoom.find({ users: { $elemMatch: { user: userId } } }).exec(function (
    err,
    data
  ) {
    console.log(data);
    if (err) {
      res.status(500).json({
        resultcode: 1,
        message: "Error retrieving chat-room with id",
      });
    }
    if (!data) {
      res.status(404).json({ resultcode: 1, message: "Not found chat-room" });
    }
    // data.map(item => {
    //   item.users.filter(user => {
    //     console.log(user.user != userId)
    //     return user.user !== userId;
    //   })
    // })
    res.json(data);
  });
};

exports.createChatRoom = async (req, res) => {
  const users =  req.body.users;
  const newChatRoom = new ChatRoom({
    users
  });
  // const nameRegex = /^[A-Za-z\s]+$/;
  // if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";
  // const existedChatRoom = await ChatRoom.find({ name });
  // if (existedChatRoom) {
  //   throw "Chatroom already exists";
  // }

  // const newChatRoom = new ChatRoom({ name });

//   await newChatRoom.save();
//   res.json({
//     message: "ChatRoom created!",
//   });

  ChatRoom.addNewChatRoom(newChatRoom, (err, chatRoom) => {
    if (err) {
      res.json({
        success: false,
        msg: "Can not create Chat room",
      });
    } else {
      res.json({
        data: chatRoom,
        success: true,
        msg: "Successfully created a chat room",
      });
    }
  });
};
