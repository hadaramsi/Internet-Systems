import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'
import auth from '../controllers/auth.js'

router.get('/', auth.authenticateMiddleware, post.getAllPosts)
router.post('/', auth.authenticateMiddleware, post.addNewPost)
router.get('/:id', auth.authenticateMiddleware, post.getPostById)
router.put('/:id', auth.authenticateMiddleware, post.putPostById)

export = router