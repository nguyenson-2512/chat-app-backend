const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const CONFIG = require("./config/config");
const User = require("./models/User.model");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: "*",
  },
});


//login test
// parse application/x-www-form-urlencoded;
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//secure express app by setting various http header
app.use(helmet());
app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:19006");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//Cross-Origin Resource Sharing => secure
// app.use(cors())

//* Routes *//
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

http.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
});

const onlineUsers = {};

io.on("connection", function (socket) {
  //get chatRoomId from client
  socket.on("current-chatroom", (chatRoomId) => {
    console.log(chatRoomId, "hehe");
    Chat.find()
      .where("chatRoomId")
      .equals(chatRoomId)
      .sort({ createdAt: -1 })
      .limit(10)
      .exec((err, chats) => {
        if (err) return console.error(err);

        // Send the last messages to the user.
        socket.emit("init", chats);
      });
  });

  // Listen to connected users for a new message.
  socket.on("chat", (chat) => {
    console.log(chat, "chat dc gui len");
    const newChat = new Chat({
      content: chat.content,
      chatRoomId: chat.chatRoomId,
      user: chat.user,
    });
    console.log(newChat, "newchat dc tao ra");

    // Save the message to the database.
    Chat.addNewChat(newChat, (err, chatItem) => {
      console.log("chat-item;", chatItem);
      if (err) return console.error(err);
      ChatRoom.findById(newChat.chatRoomId, (err, chatRoom) => {
        let lastMessage = {
          id: newChat._id,
          content: newChat.content,
          createAt: newChat.createdAt,
        };
        if (err) return console.error(err);
        chatRoom.chats.push(newChat);
        chatRoom.lastMessage = Object.assign({}, lastMessage);
        chatRoom.save();
      });
      socket.emit("new-chat", chatItem);
    });

    // Notify all other users about a new message.
    // socket.broadcast.emit("push", chat);

    //call event
    // socket.on('join-call', function (data) {
    //   socket.join(data.user);
    // });
  });

  // To subscribe the socket to a given channel
  socket.on('join', function (data) {
    socket.join(data.username);
  });

  socket.on('userPresence', function (data) {
    onlineUsers[socket.id] = {
      username: data.username
    };
    // socket.broadcast.emit('onlineUsers', onlineUsers);
    socket.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', function (data) {
    socket.broadcast.emit('disconnected', onlineUsers[socket.id].username);
    delete onlineUsers[socket.id];
    socket.broadcast.emit('onlineUsers', onlineUsers);
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
