const { model, Schema } = require("mongoose");

const ChatRoomSchema = new Schema({
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      imageUri: String,
    },
  ],
  lastMessage: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    content: String,
    createAt: {
      type: Date,
    },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

// ChatRoomSchema.methods.addNewChatRoom = function (newChatRoom, callback) {
//   newChatRoom.save(callback);
// };

module.exports = ChatRoom = model("ChatRoom", ChatRoomSchema);

module.exports.addNewChatRoom = function (newChatRoom, callback) {
  newChatRoom.save(callback);
};
