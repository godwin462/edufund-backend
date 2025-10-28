const { createAcademicDetails, deleteAcademicDetails, updateAcademicDetails, getAcademicDetails } = require('../controllers/academicController')

const academicRouter = require('express').Router();

academicRouter.post('/:studentId', createAcademicDetails);

academicRouter.get('/:studentId', getAcademicDetails)

academicRouter.put('/:academicDetailsId', updateAcademicDetails);

// academicRouter.delete('/:academicDetails', deleteAcademicDetails);

module.exports = academicRouter;
