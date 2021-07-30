const { model, Schema } = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    imageUri: {
      type: String,
      // required: true,
    },
    sendRequest: [
      {
        id: {
          type: String,
          required: true,
        },
        username: String,
        imageUri: String,
      },
    ],
    request: [
      {
        id: {
          type: String,
          required: true,
        },
        username: String,
        imageUri: String,
      },
    ],
    friendList: [
      {
        id: {
          type: String,
          required: true,
        },
        username: String,
        imageUri: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User = model("User", UserSchema);
