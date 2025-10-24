const contactUsRouter = require("express").Router();
const { contactUs } = require("../controllers/contactUsController");

contactUsRouter.post("/", contactUs);

module.exports = contactUsRouter;
