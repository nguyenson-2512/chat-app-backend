const { model, Schema } = require("mongoose");

const ChatSchema = new Schema({
  content: {
    type: String,
    // required: true,
  },
  chatRoomId: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: "ChatRoom",
  },
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    imageUri: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  like: {
    type: Boolean,
    required: false,
  }
});

module.exports = Chat = model("Chat", ChatSchema);

module.exports.addNewChat = function (newChat, callback) {
  newChat.save(callback);
};