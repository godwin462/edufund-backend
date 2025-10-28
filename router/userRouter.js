const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const upload = require("../middleware/multerMiddleware");
const userRouter = require("express").Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:userId", getUser);
userRouter.delete("/:userId",
  //  isAuthenticated,
    deleteUser);
userRouter.patch(
  "/:userId",
  upload.single("profilePicture"),
  isAuthenticated,
  updateUser
);

module.exports = userRouter;
