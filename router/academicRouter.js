const { createAcademicDetails, deleteAcademicDetails, updateAcademicDetails, getAcademicDetails } = require('../controllers/academicController')

const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { studentAccess } = require('../middleware/roleMiddleware');

const { studentAccess } = require("../middleware/roleMiddleware");

const academicRouter = require('express').Router();

academicRouter.post('/:studentId', isAuthenticated, studentAccess, createAcademicDetails);

academicRouter.get('/:studentId', isAuthenticated, studentAccess, getAcademicDetails)

academicRouter.put('/:academicDetailsId', studentAccess, isAuthenticated, updateAcademicDetails);

// academicRouter.delete('/:academicDetails', isAuthenticated, studentAccess, deleteAcademicDetails);

module.exports = academicRouter;
