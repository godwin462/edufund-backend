const { getAllUsers, getUser, deleteUser, updateUser } = require("../controllers/userController");

const userRouter = require("express").Router();
userRouter.get("/", getAllUsers);
userRouter.get("/:userId", getUser);
userRouter.delete("/:userId", deleteUser);
userRouter.patch("/:userId", updateUser);

module.exports = userRouter;
