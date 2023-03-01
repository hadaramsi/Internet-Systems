import Post from '../models/post_model'
import request from '../request'
import response from '../response'
import error from '../error'

// const getAllPostsEvent = async () => {
//     console.log("")
//     try {
//         const posts = await Post.find()
//         return { status: 'OK', data: posts }
//     } catch (err) {
//         return { status: 'FAIL', data: "" }
//     }
// }
const getAllPosts = async (req: request) => {
    try {
        let posts = {}
        console.log("req!-------------------------")
        console.log(req)

        if (req.query.sender == null || req.query == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({ sender: req.query.sender })
        }
        return new response(posts, req.userId, null)
    } catch (err) {
        return new response(null, req.userId, new error(400, err.message))
    }
}
// const getUserPosts = async (req: request) => {
//     try {
//         // let posts = {}
//         const posts = await Post.findByUserId(req.params.id)
//         // if (req.query.sender == null || req.query == null) {
//         //     posts = await Post.find()
//         // } else {
//         //     posts = await Post.find({ sender: req.query.sender })
//         // }
//         return new response(posts, req.userId, null)
//     } catch (err) {
//         return new response(null, req.userId, new error(400, err.message))
//     }
// }

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
        console.log("req in putPostById")
        console.log(req)
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log("update post :")
        console.log("success to update post in db")
        console.log(post)
        return new response(post, req.userId, null)
    } catch (err) {
        console.log("fail to update post in db")
        return new response(null, req.userId, new error(400, err.message))
    }
}
const deletePost = async (req: request) => {
    try {
        console.log("delete post - back")

        await Post.findByIdAndDelete(req.params.id)
        return new response(null, req.userId, null)
    } catch (err) {
        console.log("fail to delete post in db")
        return new response(null, req.userId, new error(400, err.message))
    }
}
const addNewPost = async (req: request) => {
    console.log(req.body)
    const msg = req.body["message"]
    const sender = req.body["userId"]
    const image = req.body["imageUrl"]

    const post = new Post({
        message: msg,
        sender: sender,
        imageUrl: image
    })
    console.log("before try add new post")

    try {
        const newPost = await post.save()
        console.log("save post")
        return new response(newPost, req.userId, null)
    } catch (err) {
        console.log(err)
        console.log("dont save post")

        return new response(null, req.userId, new error(400, err.message))
    }
}

export = { getAllPosts, addNewPost, getPostById, putPostById, deletePost }
