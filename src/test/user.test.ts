import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import User from '../models/user_model'

let newUserId = ""
const email = "user@gmail.com"
const password = "123456"
const imageUrl = "url"
const fullName = "name"
const fullNameRes = "name"
let accessToken = ""

beforeAll(async () => {
    await User.remove()
    console.log('beforeAll')
    const res = await request(app).post("/auth/register").send({
        email: email,
        password: password,
        image: imageUrl,
        fullName: fullName,
    });
    newUserId = res.body._id;
})
async function loginUser() {
    const response = await request(app).post("/auth/login").send({
        email: email,
        password: password,
    });
    accessToken = response.body.tokens.accessToken;
}

beforeEach(async () => {
    await loginUser();
});

afterAll(async () => {
    console.log('afterAll')
    mongoose.connection.close()
})

describe("User Tests", () => {
    // test("add new user", async () => {
    //     const response = await request(app).post('/user')
    //         .send({
    //             "_id": 1234,
    //             "name": "Oren",
    //             "avatarUrl": "www.localhost:3000/oren.jpg"
    //         })
    //     expect(response.statusCode).toEqual(200)
    //     newUserId = response.body._id
    // })

    test("get all users", async () => {
        const response = await request(app).get('/user')
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })

    test("get user by id", async () => {
        const response = await request(app).get('/user/' + newUserId).set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body._id).toEqual(newUserId);
        expect(response.body.fullName).toEqual(fullName);
    })
})