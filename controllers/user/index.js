const User = require("../../models/User.model");
const _ = require("lodash");
const {
  validateLoginInput,
  validateRegisterInput,
} = require("../../utils/validators");
const { generateToken } = require("../../utils/token-management");
const bcrypt = require("bcryptjs");

exports.login = (req, res) => {
    const { username, password } = req.body;
    const { valid, errors } = validateLoginInput(username, password);
    if (!valid) {
      res.status(400).json({ resultcode: 1, message: errors });
    }
    User.findOne({ username})
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
}

exports.register = async (req, res) => {
    const { username, password, email, confirmPassword } = req.body;
    const { valid, errors } = validateRegisterInput(
      username,
      email,
      password,
      confirmPassword
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
            });
            const userSave = await newUser.save();
            const token = generateToken(userSave);
            res
              .status(200)
              .json({ resultcode: 0, data: { id: userSave._id, token } });
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
  