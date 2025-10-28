const { createAcademicDetails, deleteAcademicDetails, updateAcademicDetails, getAcademicDetails } = require('../controllers/academicController')

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const academicRouter = require('express').Router();

academicRouter.post('/:studentId', isAuthenticated, createAcademicDetails);

academicRouter.get('/:studentId', isAuthenticated, getAcademicDetails)

academicRouter.put('/:academicDetailsId', isAuthenticated, updateAcademicDetails);

// academicRouter.delete('/:academicDetails', isAuthenticated, deleteAcademicDetails);

module.exports = academicRouter;
