import Post from '../models/post_model'
import request from '../request'
import response from '../response'
import error from '../error'
import { Request, Response } from 'express'

const getAllPostsEvent = async () => {
    console.log("")
    try {
        const posts = await Post.find()
        return { status: 'OK', data: posts }
    } catch (err) {
        return { status: 'FAIL', data: "" }
    }
}
const getAllPosts = async (req: request) => {
    try {
        let posts = {}
        if (req.query.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({ 'sender': req.query.sender })
        }
        return new response(posts, req.userId, null)
    } catch (err) {
        return new response(null, req.userId, new error(400, err.message))
    }
}

const getPostById = async (req: request) => {
    try {
        const posts = await Post.findById(req.params.id)
        return new response(posts, req.userId, null)
    } catch (err) {
        return new response(null, req.userId, new error(400, err.message))
    }
}


const putPostById = async (req: request) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return new response(post, req.userId, null)
    } catch (err) {
        console.log("fail to update post in db")
        return new response(null, req.userId, new error(400, err.message))
    }
}
const addNewPost = async (req: request) => {
    console.log(req.body)
    const msg = req.body["message"]
    const sender = req.body["sender"]
    const post = new Post({
        message: msg,
        sender: sender
    })
    console.log("before try add new post")

    try {
        const newPost = await post.save()
        console.log("save post")
        return new response(newPost, req.userId, null)
    } catch (err) {
        console.log("dont save post")

        return new response(null, req.userId, new error(400, err.message))
    }
}

export = { getAllPosts, addNewPost, getPostById, putPostById, getAllPostsEvent }
