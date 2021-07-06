const { Router } = require("express");
const {
  getCurrentUser,
  getUsers,
  getUserById,
  getAllAnotherUsers
} = require("../controllers/user/index");

const userRoutes = Router();

userRoutes.get("/current-user", getCurrentUser);
userRoutes.get("/:id/list-users", getAllAnotherUsers);
userRoutes.get("/:id", getUserById);

module.exports = userRoutes;
