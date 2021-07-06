const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CONFIG = require("./config/config");
const User = require("./models/User.model");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");

// const LocalStrategy = require('passport-local').Strategy;
// const passport = require('passport');

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//login test
// parse application/x-www-form-urlencoded;
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//secure express app by setting various http header
app.use(helmet());

//Cross-Origin Resource Sharing => secure
// app.use(cors())

//* Auth Routes *//
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

http.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
});

io.on("connection", function (socket) {

  //get chatRoomId from client
  socket.on('current-chatroom',(chatRoomId) => {
    console.log(chatRoomId)
    Chat.find().where('chatRoomId').equals(chatRoomId).sort({ createdAt: -1 }).limit(10).exec((err, chats) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.emit("init", chats);
    })
  })

  // Get the last 10 messages from the database.
  // ChatRoom.find()
  //   .sort({ createdAt: -1 })
  //   .limit(10)
  //   .exec((err, chats) => {
  //     if (err) return console.error(err);

  //     // Send the last messages to the user.
  //     socket.emit("init", chats);
  //   });

  //client get .socket.on('init', (msg) => {} setState()

  //client emit new chat

  // Listen to connected users for a new message.
  socket.on("chat", (chat) => {
    // Create a message with the content and the name of the user.
    const newChat = new Chat({
      content: chat.content,
      chatRoomId: chat.chatRoomId,
      user: chat.user,
    });

    // Save the message to the database.
    Chat.addNewChat(newChat, (err, chatItem) => {
      console.log('chat-item;', chatItem);
      if (err) return console.error(err);
      ChatRoom.findById(newChat.chatRoomId, (err, chatRoom) => {
        // console.log('newChat to add last message: ',newChat)
        // console.log('chatRoom to add last message: ',chatRoom)
        let lastMessage = {
          id: newChat._id,
          content: newChat.content,
          createAt: newChat.createdAt
        }
        if (err) return console.error(err);
        chatRoom.chats.push(newChat);
        chatRoom.lastMessage= Object.assign({}, lastMessage);
        chatRoom.save();
      })
      socket.emit('new-chat', chatItem);
    });

    // Notify all other users about a new message.
    // socket.broadcast.emit("push", chat);


    //call event
    // socket.on('join-call', function (data) {
    //   socket.join(data.user);
    // });
  });
});
io.listen(8000);

app.get("/", (req, res) => res.send("Hello world!"));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(CONFIG.mongoURI, options)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
