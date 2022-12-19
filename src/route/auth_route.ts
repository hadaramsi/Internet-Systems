/**
* @swagger
* tags:
* name: Auth
* description: The Authentication API
*/

import express from 'express'
const router = express.Router()
import auth from '../controllers/auth.js'

router.post('/login', auth.login)
router.post('/register', auth.register)
router.get('/refresh', auth.refresh)
router.get('/logout', auth.logout)



export = router

