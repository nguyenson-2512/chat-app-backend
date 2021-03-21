const { model, Schema } = require("mongoose");

const ChatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  chatRoom: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ChatRoom",
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ChatSchema.methods.addNewMessage = function(newMessage, callback) {
//     newMessage.save(callback);
// }

module.exports = Chat = model("Chat", ChatSchema);
