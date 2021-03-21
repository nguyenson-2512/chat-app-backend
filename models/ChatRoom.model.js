const { model, Schema } = require("mongoose");

const ChatRoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// ChatRoomSchema.methods.addNewChatRoom = function (newChatRoom, callback) {
//   newChatRoom.save(callback);
// };

module.exports = ChatRoom = model("ChatRoom", ChatRoomSchema);
