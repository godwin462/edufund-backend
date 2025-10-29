const contactUsRouter = require("express").Router();
const { contactUs } = require("../controllers/contactUsController");

/**
 * @swagger
 * tags:
 *   name: Contact Us
 *   description: Contact us endpoint
 */

/**
 * @swagger
 * /contact-us:
 *   post:
 *     summary: Submit a contact us form
 *     tags: [Contact Us]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Message sent successfully
 *       "500":
 *         description: Server error
 */
contactUsRouter.post("/", contactUs);

module.exports = contactUsRouter;