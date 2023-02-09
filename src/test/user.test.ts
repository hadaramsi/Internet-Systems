import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import User from '../models/user_model'

let newUserId = ""

beforeAll(async () => {
    await User.remove()
    console.log('beforeAll')
})

afterAll(async () => {
    console.log('afterAll')
    mongoose.connection.close()
})

describe("User Tests", () => {
    test("add new user", async () => {
        const response = await request(app).post('/user')
            .send({
                "_id": 1234,
                "name": "Oren",
                "avatarUrl": "www.localhost:3000/oren.jpg"
            })
        expect(response.statusCode).toEqual(200)
        newUserId = response.body._id
    })

    test("get all users", async () => {
        const response = await request(app).get('/user')
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })

    test("get user by id", async () => {
        const response = await request(app).get('/user/' + newUserId)
        expect(response.statusCode).toEqual(200)
    })
})