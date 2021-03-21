const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet")
const CONFIG = require("./config/config");
const User = require('./models/User.model')
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')


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
app.use(helmet())

//Cross-Origin Resource Sharing => secure
// app.use(cors())

//* Auth Routes *//
app.use("/api/users", authRoutes);
app.use('/api/chat', chatRoutes);






http.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
});

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("User Disconnected");
  });
  socket.on("example_message", function (msg) {
    console.log("message: " + msg);
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
