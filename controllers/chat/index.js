const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
// const ChatRoom = mongoose.model("ChatRoom");
const ChatRoom = require("../../models/ChatRoom.model");
const Chat = require("../../models/Chat.model");
const User = require("../../models/User.model");

const http = require("http").Server(express);
const io = require("socket.io")(http);

//get all chats by chatroom's id
exports.getAllChats = (req, res) => {
  ChatRoom.findById(req.params.id)
    .populate("chats")
    .sort({ createdAt: -1 })
    .exec((err, chats) => {
      if (err) throw err;
      res.json(chats);
    });
};

//get chat item by id
exports.getChat = (req, res) => {
  Chat.findById(req.params.chatId)
    .then((data) => {
      if (!data) {
        res.status(404).json({ resultcode: 1, message: "Not found chat" });
      } else {
        res.status(200).json({ resultcode: 0, data });
      }
    })
    .catch((err) => {
      res.status(500).json({
        resultcode: 1,
        message: "Error retrieving chat with id",
      });
    });
};

//create new chat
exports.createChat = (req, res, next) => {
  if (!req.body.content) {
    res
      .status(400)
      .json({ resultcode: 1, message: "Content can not be empty!" });
    return;
  }

  const chatRoomId = req.params.id;
  const user = req.body.user;
  const newChat = new Chat({
    content: req.body.content,
    chatRoomId,
    user,
  });

  Chat.addNewChat(newChat, (err, chat) => {
    if (err) {
      res.json({
        success: false,
        msg: "Can not create Chat",
      });
    } else {
      //socket
      io.on("connection", function (socket) {
        console.log("A New msg send....");
        //find theo chat room id
        Chat.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .exec((err, messages) => {
            if (err) return console.error(err);

            // Send the last messages to the user.
            socket.emit("init", messages);
          });

        // socket.on('getMsgBy', function(data) {
        //     console.log(data);
        //     socket.emit('msgData', {msgBy: data});
        // });

        // socket.on('msgToAll', function(data) {
        //     //Send message to everyone
        //     io.sockets.emit('newmsg', data);
        // });

        socket.on("message", (msg) => {
          // Create a message with the content and the name of the user.
          const message = new Chat({
            content: msg.content,
            content: req.body.content,
            chatRoomId,
            user,
          });

          // Save the message to the database.
          message.save((err) => {
            if (err) return console.error(err);
          });

          // Notify all other users about a new message.
          socket.broadcast.emit("push", msg);
        });
      });
      res.json({
        success: true,
        msg: "Successfully created a chat",
      });
    }
  });

  // ChatRoom.findById(req.params.id, (err, chatRoom) => {
  //   console.log("rooom build:", chatRoom);
  //   if (err) res.send("Chat not found.");

  //   Chat.create(newChat, (err, chat) => {
  //     console.log(" build:", chat);
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       chat.save();
  //       chatRoom.chats.push(chat);
  //       chatRoom.save();
  //     }
  //   });

  //   // Push new message to array
  //   // messagesArray.push(newMessage);
  // }).then((chat) => {
  //   res.json(chat);
  // });
};

//delete chat item by id
exports.deleteChat = (req, res) => {
  const chatId = req.params.chatId;
  Chat.findById(chatId)
    .then((chat) => chat.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
  // Chat.findById(req.params.chatId)
  //   .then((data) => {
  //     if (!data) {
  //       res.status(404).json({ resultcode: 1, message: "Not found chat" });
  //     } else {
  //       res.status(200).json({ resultcode: 0, data });
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       resultcode: 1,
  //       message: "Error retrieving chat with id",
  //     });
  //   });

  // Chat.findByIdAndRemove({ _id: req.params.id })
  //   .then((data) => {
  //     if (!data) {
  //       res
  //         .status(404)
  //         .json({ resultcode: 1, message: "Cannot delete chat with id" });
  //     } else {
  //       res.status(200).json({
  //         resultcode: 0,
  //         message: "Post deleted!",
  //         chat: data,
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       resultcode: 1,
  //       message: "Error delete chat with id",
  //     });
  //   });
};

exports.like = (req, res) => {
  const chatId = req.params.chatId;
  Chat.findByIdAndUpdate(
    chatId,
    { like: true },
    { new: true },
    function (err, data) {
      if (!data) {
        return res.status(404).json({
          resultcode: 1,
          message: `Cannot update chat item with id ${chatId}!`,
        });
      }
      if (err) {
        return res.status(500).json({
          resultcode: 1,
          message: "Error updating chat item with id " + chatId,
        });
      }

      return res.status(201).json({
        resultcode: 0,
        message: "Chat item updated!",
        chat: data,
      });
    }
  );
};
