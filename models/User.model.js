const { model, Schema } = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  imageUri: {
    type: String,
    // required: true,
  },
});

UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}


module.exports = User = model("User", UserSchema);
