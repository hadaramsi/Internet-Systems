"use strict";
/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const auth_1 = __importDefault(require("../controllers/auth"));
const router = express_1.default.Router();
/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - id
*         - name
*         - avatarUrl
*       properties:
*         id:
*           type: string
*           description: The user id
*         name:
*           type: string
*           description: The user name
*         avatarUrl:
*           type: string
*           description: The user avatar url
*       example:
*         id: '123'
*         name: 'Oren'
*         avatarUrl: 'www.mysute/oren.jpg'
*/
/**
 * @swagger
 * /student:
 *   get:
 *     summary: get list of post from server
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Student'
 *
 */
router.get('/', user_1.default.getAllUsers);
/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: get student by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.get('/:id', auth_1.default.authenticateMiddleware, user_1.default.getUserById);
/**
 * @swagger
 * /student:
 *   post:
 *     summary: add a new post
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: the requested student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *
 */
router.post('/', user_1.default.addNewUser);
/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: put user by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.get('/:id', auth_1.default.authenticateMiddleware, user_1.default.putUserById);
module.exports = router;
//# sourceMappingURL=user_route.js.map