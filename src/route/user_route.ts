/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/

import express from 'express'
import user from '../controllers/user'
import auth from '../controllers/auth'
const router = express.Router()

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
 * /user/{id}:
 *   get:
 *     summary: get user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested user id
 *     responses:
 *       200:
 *         description: the requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
router.get('/:id', auth.authenticateMiddleware, user.getUserById)

/**
 * @swagger
 * /user/add:
 *   post:
 *     summary: add new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Register success retuns user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Registeration error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: The error description 
 *  
 */
router.post('/', user.addNewUser)
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: update user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated user id
 *     responses:
 *       200:
 *         description: the updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
router.put('/:id', auth.authenticateMiddleware, user.putUserById)

export = router