import Post from '../models/post_model'
import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
const newPostMessage = 'This is the new test post message'
const newPostSender = '999000'
let newPostId = ''
const newPostMessageUpdated = 'This is the update message'
beforeAll(async () => {
    await Post.remove()
})

afterAll(async () => {
    await Post.remove()
    mongoose.connection.close()
})

describe("Posts Tests", () => {
    test("add new post", async () => {
        const response = await request(app).post('/post').send({
            "message": newPostMessage,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
        newPostId = response.body._id

    })
    test("get all posts", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })
    test("get post by Id", async () => {
        const response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
    test("get post by wrong id fails", async () => {
        const response = await request(app).get('/post/12345')
        expect(response.statusCode).toEqual(400)
    })
    test("get post by sender", async () => {
        const response = await request(app).get('/post?sender=' + newPostSender)
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })
    // test("get all posts containing given text in post message", async () => {
    //     const response = await request(app).get('/post?message=new')
    //     expect(response.statusCode).toEqual(200)
    //     expect(response.body[0].message).toEqual(newPostMessage)
    //     expect(response.body[0].sender).toEqual(newPostSender)
    // })
    test("update post by id", async () => {
        let response = await request(app).put('/post/' + newPostId).send({
            "message": newPostMessageUpdated,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.sender).toEqual(newPostSender)

        response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.sender).toEqual(newPostSender)

        response = await request(app).put('/post/12345').send({
            "message": newPostMessageUpdated,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).send({
            "message": newPostMessageUpdated,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.sender).toEqual(newPostSender)
    })

})