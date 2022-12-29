import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import postController from "../controllers/post"
import request from '../request'

export = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const getAllPosts = async (body) => {
        console.log("getAllPosts with socketId: %s", socket.id)
        try {
            const response = await postController.getAllPosts(new request(body, socket.data.user, null, null));
            socket.emit('post:get_all.response', response)
        } catch (err) {
            socket.emit('post:get_all.response', { 'status': 'fail' })
        }
    }

    const addNewPost = async (body) => {
        console.log("postAdd with socketId: %s", socket.id)
        try {
            const response = await postController.addNewPost(new request(body, socket.data.user, null, null))
            socket.emit('post:add_new.response', response)
        } catch (err) {
            socket.emit('post:add_new.response', { 'status': 'fail' })
        }
    }

    const getPostById = async (body) => {
        console.log("getPostById with socketId: %s", socket.id)
        try {
            const response = await postController.getPostById(new request(body, socket.data.user, null, null))
            socket.emit('post:get_by_id.response', response)
        } catch (err) {
            socket.emit('post:get_by_id.response', { 'status': 'fail' })
        }
    }
    // const addNewPost = (payload) => {
    //     socket.emit('echo:echo', payload)
    // }


    console.log('register echo handlers')
    socket.on("post:get_all", getAllPosts)
    socket.on("post:get_by_id", getPostById)
    socket.on("post:add_new", addNewPost)
}