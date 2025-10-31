const studentVerificationRouter = require('express').Router();

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const { studentAccess } = require("../middleware/roleMiddleware");

const upload = require("../middleware/multerMiddleware");



studentVerificationRouter.post('/:studentId', upload.single('verificationDocument'), isAuthenticated, studentAccess, studentVerificationController.submitVerification);

studentVerificationRouter.get('/:studentId', isAuthenticated, studentAccess, studentVerificationController.getVerificationStatus);

studentVerificationRouter.put('/:verificationId', upload.single('verificationDocument'), isAuthenticated, studentAccess, studentVerificationController.updateVerificationDocument);

module.exports = studentVerificationRouter;