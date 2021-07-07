const { Router } = require("express");
const {
  getCurrentUser,
  getUsers,
  getUserById,
  getAllAnotherUsers,
  update
} = require("../controllers/user/index");

const userRoutes = Router();

userRoutes.put("/edit/:id", update);
userRoutes.get("/current-user", getCurrentUser);
userRoutes.get("/:id/list-users", getAllAnotherUsers);
userRoutes.get("/:id", getUserById);

module.exports = userRoutes;
