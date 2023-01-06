import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import postController from "../controllers/post"
import request from '../request'

export = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const getAllPosts = async (body) => {
        console.log("getAllPosts with socketId: %s", socket.data.user)
        try {
            const response = await postController.getAllPosts(new request(body, socket.data.user, null, null))
            socket.emit('post:get.response', response)
        } catch (err) {
            socket.emit('post:get.response', { status: 'fail' })
        }
    }

    const addNewPost = async (body) => {
        console.log("postAdd with socketId: %s", socket.id)
        try {
            const response = await postController.addNewPost(new request(body, socket.data.user, null, null))
            socket.emit('post:add.response', response)
        } catch (err) {
            socket.emit('post:add.response', { status: 'fail' })
        }
    }

    const getPostById = async (body) => {
        console.log("getPostById with socketId: %s", socket.id)
        try {
            const response = await postController.getPostById(new request(body, socket.data.user, null, body))
            socket.emit('post:get:id.response', response)
        } catch (err) {
            socket.emit('post:get:id.response', { status: 'fail' })
        }
    }

    const getPostBySender = async (body) => {
        console.log('getPostBySender with socketId: %s', socket.data.user);
        try {
            const response = await postController.getAllPosts(new request(body, socket.data.user, body, null));
            socket.emit('post:get:sender.response', response);
        } catch (err) {
            socket.emit('post:get:sender.response', { status: 'fail' });
        }
    };

    const updatePostById = async (body) => {
        console.log('updatePostById with socketId: %s', socket.data.user);
        try {
            const response = await postController.putPostById(new request(body, socket.data.user, null, body));
            socket.emit('post:put.response', response);
        } catch (err) {
            socket.emit('post:put.response', { status: 'fail' });
        }
    };

    console.log('register echo handlers')
    socket.on("post:get", getAllPosts)
    socket.on("post:get:id", getPostById)
    socket.on("post:add", addNewPost)
    socket.on("post:get:sender", getPostBySender)
    socket.on("post:put", updatePostById)
}