const User = require("../../models/User.model");
const _ = require("lodash");
const {
  validateLoginInput,
  validateRegisterInput,
} = require("../../utils/validators");
const { generateToken } = require("../../utils/token-management");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./images");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.login = (req, res) => {
  const { username, password } = req.body;
  const { valid, errors } = validateLoginInput(username, password);
  if (!valid) {
    res.status(400).json({ resultcode: 1, message: errors });
  }
  User.findOne({ username })
    .then(async (user) => {
      if (!user) {
        errors.general = "User not found";
        res.status(404).json({ resultcode: 1, message: errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        res.status(400).json({ resultcode: 1, message: errors });
      }
      const token = generateToken(user);
      res.status(200).json({ resultcode: 0, data: { user, token } });
    })
    .catch((err) => {
      res.status(500).json({
        resultcode: 1,
        message: err.message || "Some error occurred.",
      });
    });
};

exports.register = async (req, res) => {
  const { username, password, email, confirmPassword, imageUri } = req.body;
  const { valid, errors } = validateRegisterInput(
    username,
    email,
    password,
    confirmPassword,
    imageUri
  );
  if (!valid) {
    res.status(400).json({ resultcode: 1, message: errors });
  } else {
    User.findOne({ username })
      .then(async (user) => {
        if (user) {
          res.status(400).json({
            resultcode: 1,
            message: "This username is taken",
          });
        } else {
          const hashPassword = await bcrypt.hash(password, 12);
          const newUser = new User({
            email,
            username,
            password: hashPassword,
            imageUri,
          });
          const userSave = await newUser.save();
          const token = generateToken(userSave);
          res
            .status(200)
            .json({ resultcode: 0, data: { user: userSave, token } });
        }
      })
      .catch((err) => {
        res.status(500).json({
          resultcode: 1,
          message: err.message || "Some error occurred.",
        });
      });
  }
};

exports.getCurrentUser = (req, res) => {
  res.send(req.user);
};

exports.getUsers = (req, res) => {
  User.find({}, (err, users) => {
    res.send(users);
  });
};

exports.getUserById = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.send("User not found.");
    } else {
      res.send(user);
    }
  });
};

exports.getAllAnotherUsers = (req, res) => {
  const myUserId = req.params.id;
  User.find(
    { _id: { $ne: mongoose.Types.ObjectId(myUserId) } },
    (err, users) => {
      res.send(users);
    }
  );
};

exports.update = (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  User.findByIdAndUpdate(id, body, { new: true }, function (err, data) {
    if (!data) {
      return res.status(404).json({
        resultcode: 1,
        message: `Cannot update user with id ${id}!`,
      });
    }
    if (err) {
      return res.status(500).json({
        resultcode: 1,
        message: "Error updating user with id " + id,
      });
    }
    return res.status(201).json({
      resultcode: 0,
      message: "User updated!",
      user: data,
    });
  });
};

exports.sendRequest = (req, res) => {
  const { sender, receiver } = req.body;

  User.findById(sender.id, (err, user) => {
    if (err) return console.error(err);
    user.sendRequest.push(receiver);
    user.save();
  });

  User.findById(receiver.id, (err, user) => {
    if (err) return console.error(err);
    user.request.push(sender);
    user.save();
  });

  return res.status(201).json({
    resultcode: 0,
    message: "Success",
  });
};

exports.getRequestList = (req, res) => {
  const myUserId = req.params.id;
  User.findById(myUserId)
    .select("sendRequest request friendList")
    .then((response) => {
      return res.status(201).json({
        resultcode: 0,
        data: response,
      });
    });
};

exports.acceptRequest = (req, res) => {
  const { acceptorUser, acceptedUser } = req.body;

  User.findById(acceptorUser.id, (err, user) => {
    if (err) return console.error(err);
    user.friendList.push(acceptedUser);
    user.request.splice(
      user.request.findIndex(function (i) {
        return i.id == acceptedUser.id;
      }),
      1
    );
    user.save();
  });

  User.findById(acceptedUser.id, (err, user) => {
    if (err) return console.error(err);
    user.friendList.push(acceptorUser);
    user.sendRequest.splice(
      user.sendRequest.findIndex(function (i) {
        return i.id == acceptorUser.id;
      }),
      1
    );
    user.save();
  });

  return res.status(201).json({
    resultcode: 0,
    message: "Success",
  });
};
