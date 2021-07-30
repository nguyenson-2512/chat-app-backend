const { Router } = require("express");
const {
  getCurrentUser,
  getUsers,
  getUserById,
  getAllAnotherUsers,
  update,
  sendRequest,
  getRequestList,
  acceptRequest,
} = require("../controllers/user/index");

const userRoutes = Router();

userRoutes.put("/edit/:id", update);
userRoutes.get("/current-user", getCurrentUser);
userRoutes.get("/:id/list-users", getAllAnotherUsers);
userRoutes.get("/:id", getUserById);
userRoutes.get("/request/:id", getRequestList);
userRoutes.post("/send-request", sendRequest);
userRoutes.post("/accept-request", acceptRequest);

module.exports = userRoutes;
