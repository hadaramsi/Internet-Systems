import Post from '../models/post_model'
import User from '../models/user_model'
import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
const newPostMessage = 'This is the new test post message'
let newPostSender = ''
let newPostId = ''
let newPostImage = 'url'
const imageUrl = "url"
const fullName = "name"

let userId = ''
const newPostMessageUpdated = 'This is the update message'

const userEmail = "user1@gmail.com"
const userPassword = "12345"
let accessToken = ''

beforeAll(async () => {
    await Post.remove()
    await User.remove()
    const res = await request(app).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "image": imageUrl,
        "fullName": fullName,
    })
    newPostSender = res.body._id
})

async function loginUser() {
    const response = await request(app).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    })
    accessToken = response.body.tokens.accessToken
}

beforeEach(async () => {
    await loginUser()
})

afterAll(async () => {
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe("Posts Tests", () => {
    test("add new post", async () => {
        const response = await request(app).post('/post').set('Authorization', 'JWT ' + accessToken)
            .send({
                message: newPostMessage,
                userId: newPostSender,
                imageUrl: newPostImage
            })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.sender).toEqual(newPostSender)
        newPostId = response.body.post._id
    })


    test("get all posts", async () => {
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        console.log("hiiiiii")
        console.log(response.body)
        expect(response.body.post[0].message).toEqual(newPostMessage)
        expect(response.body.post[0].sender).toEqual(newPostSender)
    })

    test("get post by Id", async () => {
        const response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.sender).toEqual(newPostSender)
    })
    test("get post by wrong id fails", async () => {
        const response = await request(app).get('/post/12345').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(400)
    })
    test("get post by sender", async () => {
        const response = await request(app).get('/post?sender=' + newPostSender).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post[0].message).toEqual(newPostMessage)
        expect(response.body.post[0].sender).toEqual(newPostSender)
    })


    test("update post by id", async () => {
        let response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
            .send({
                "message": newPostMessageUpdated,
                "sender": newPostSender
            })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.sender).toEqual(newPostSender)

        response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.sender).toEqual(newPostSender)

        response = await request(app).put('/post/12345').set('Authorization', 'JWT ' + accessToken)
            .send({
                "message": newPostMessageUpdated,
                "sender": newPostSender
            })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
            .send({
                "message": newPostMessageUpdated,
            })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.sender).toEqual(newPostSender)
    })
    test("delete post", async () => {
        const response = await request(app).delete('/post/12345')
        expect(response.statusCode).toEqual(400)

    })
})