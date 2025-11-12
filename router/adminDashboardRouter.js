const adminDashRouter = require("express").Router();
const adminDashboardController = require("../controllers/adminDashboardController");

/**
 * @swagger
 * /admin/dashboard/overview:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Overview retrieved successfully
 *       500:
 *         description: Server error
 */

adminDashRouter.get("/overview", adminDashboardController.overview);

module.exports = adminDashRouter;
