import server from "../app"
import mongoose from "mongoose"
import Client, { Socket } from "socket.io-client"
import { DefaultEventsMap } from "@socket.io/component-emitter"
import Message from "../models/message_model"
import request from 'supertest'
import Post from '../models/post_model'
import User from '../models/user_model'

const newPostMessage = 'This is the new test post message - socket test'
const newImageUrl = 'url'
const anotherPostImage = 'url'

const anotherPostMessage = 'This is the another test post message - socket test'
let newPostId = ''
const newPostMessageUpdated = 'This is the update message - socket test'
let newMessage = ''
const message = "this is my message"
const userEmail = "user1@gmail.com"
const userPassword = "12345"
const userFullName = "user name"
const userImage = "url"

const userEmail2 = "user2@gmail.com"
const userPassword2 = "12345"
const userFullName2 = "user name 2"
const userImage2 = "url2"

type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    accessToken: string,
    id: string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>): Promise<string> {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1")
        });
    })
}

const connectUser = async (userEmail, userPassword, userFullName, userImage) => {
    const response1 = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "fullName": userFullName,
        "image": userImage
    })

    const userId = response1.body._id
    console.log(userId)

    const response = await request(server).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    })

    const token = response.body.tokens.accessToken
    console.log(token)

    const socket = Client('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    })
    await clientSocketConnect(socket)
    const client = { socket: socket, accessToken: token, id: userId }
    return client
}

describe("my project", () => {
    jest.setTimeout(15000)
    beforeAll(async () => {
        await Post.remove()
        await User.remove()
        await Message.remove()
        client1 = await connectUser(userEmail, userPassword, userFullName, userImage)
        client2 = await connectUser(userEmail2, userPassword2, userFullName2, userImage2)
        console.log("finish beforeAll")
    });

    afterAll(async () => {
        client1.socket.close()
        client2.socket.close()
        await Post.remove()
        await User.remove()
        await Message.remove()
        server.close()
        mongoose.connection.close()
    })

    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            console.log("echo:echo")
            expect(arg.msg).toBe('hello')
            done()
        })
        client1.socket.emit("echo:echo", { 'msg': 'hello' })
    })

    test("post add new test", (done) => {
        client1.socket.once("post:add.response", (arg) => {
            expect(arg.body.message).toBe(newPostMessage)
            expect(arg.body.sender).toBe(client1.id)
            expect(arg.body.imageUrl).toBe(newImageUrl)

            expect(arg.status).toBe('ok')
            newPostId = arg.body._id
            done()
        })
        console.log(" test post add new post")
        client1.socket.emit("post:add", {
            message: newPostMessage,
            userId: client1.id,
            imageUrl: newImageUrl

        })
    })

    test("Post get all test", (done) => {
        client1.socket.once("post:get.response", (arg) => {
            console.log("on any " + arg)
            expect(arg.status).toBe('fail')
            done()
        })
        console.log(" test post get all")
        client1.socket.emit("post:get", "stam")
    })

    test("get post by id test", (done) => {
        client1.socket.once("post:get:id.response", (arg) => {
            console.log("on any " + arg)
            expect(arg.body.message).toBe(newPostMessage)
            expect(arg.body.sender).toBe(client1.id)
            expect(arg.body.imageUrl).toBe(newImageUrl)

            expect(arg.status).toBe('ok')
            done()
        })
        console.log(" test post get post by id")
        client1.socket.emit("post:get:id", {
            id: newPostId,
        })
    })

    test("get post by worng id test", (done) => {
        client1.socket.once("post:get:id.response", (arg) => {
            console.log("on any " + arg)
            expect(arg.err.code).toBe(400)
            expect(arg.status).toBe('fail')
            done()
        })
        console.log(" test post get post byworng  id")
        client1.socket.emit("post:get:id", {
            id: 456,
        })
    })

    test("get post by sender test", (done) => {
        client1.socket.once('post:get:sender.response', (arg) => {
            console.log("on any " + arg)
            expect(arg.body[0].message).toBe(newPostMessage)
            expect(arg.body[0].sender).toBe(client1.id)
            expect(arg.body[0].imageUrl).toBe(newImageUrl)
            expect(arg.status).toBe('ok')
            done()
        });
        console.log(" test post get post by sender")
        client1.socket.emit("post:get:sender", {
            sender: client1.id,
        })
    })
    test("get post by worng sender test", (done) => {
        client1.socket.once('post:get:sender.response', (arg) => {
            console.log("on any " + arg)
            expect(arg.status).toBe("ok");
            expect(arg.body.length).toEqual(0)

            done()
        })
        console.log(" test post get post by sender")
        client1.socket.emit("post:get:sender", {
            sender: 563,
        })
    })

    // work
    test("Post put by id test", (done) => {
        client1.socket.once("post:put.response", (arg) => {
            console.log("on any" + arg)
            expect(arg.body.message).toBe(newPostMessageUpdated)
            expect(arg.body.sender).toBe(client1.id)
            expect(arg.body.imageUrl).toBe(newImageUrl)

            expect(arg.status).toBe('ok')
            done()
        })
        console.log("test post put by id")
        client1.socket.emit("post:put", {
            id: newPostId,
            message: newPostMessageUpdated,
            sender: client1.id,
            imageUrl: newImageUrl
        })
    })

    test("post add new post by another client test", (done) => {
        client2.socket.once("post:add.response", (arg) => {
            console.log("on any" + arg)
            expect(arg.body.message).toBe(anotherPostMessage)
            expect(arg.body.sender).toBe(client2.id)
            expect(arg.status).toBe('ok')
            done()
        })
        console.log("test post add new post by another client")
        client2.socket.emit("post:add", {
            message: anotherPostMessage,
            userId: client2.id,
            imageUrl: anotherPostImage
        })
    })


    test("post put by wrong id test", (done) => {
        client1.socket.once("post:put.response", (arg) => {
            console.log("on any" + arg)
            expect(arg.status).toBe("fail")
            done()
        })
        console.log("test post put by id")
        client1.socket.emit("post:put", {
            id: 7643,
            message: newPostMessageUpdated,
            sender: client1.id,
            imageUrl: newImageUrl
        })
    })

    test("post update post by id test", (done) => {
        client1.socket.once("post:put.response", (arg) => {
            console.log("on any" + arg)
            expect(arg.body.message).toBe(newPostMessageUpdated)
            expect(arg.body.sender).toBe(client1.id)
            expect(arg.body.imageUrl).toBe(newImageUrl)

            expect(arg.status).toBe('ok')
            done()
        })
        console.log("test post update post by id")
        client1.socket.emit("post:put", {
            id: newPostId,
            message: newPostMessageUpdated,
            imageUrl: newImageUrl
        })
    })
    test("Test chat send messages from client 1 to client 2", (done) => {
        client2.socket.once('chat:message', (args) => {
            expect(args.message).toBe(message)
            expect(args.from).toBe(client1.id)

            expect(args.res.status).toBe('ok')
            done()
        })
        client1.socket.emit("chat:send_message", {
            "message": message
        })
    })
    test("Test chat send empty messages", (done) => {
        client2.socket.once('chat:message', (args) => {
            expect(args.res.status).toBe('fail')
            done()
        })
        client1.socket.emit("chat:send_message", {
        })
    })

    test("Test chat get all messages from client1 to client2", (done) => {
        client1.socket.once("chat:get", (args) => {
            expect(args.body.length).toBe(1)
            expect(args.body[0].message).toBe(message)
            expect(args.body[0].sender).toBe(client1.id)
            expect(args.status).toBe('ok')
            done()
        })
        client1.socket.emit("chat:get", {
            "sender": client1.id
        })
    })


})