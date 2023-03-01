"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
let newUserId = "";
const email = "user@gmail.com";
const password = "123456";
const imageUrl = "url";
const fullName = "name";
const fullNameRes = "name";
let accessToken = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.remove();
    console.log('beforeAll');
    const res = yield (0, supertest_1.default)(server_1.default).post("/auth/register").send({
        email: email,
        password: password,
        image: imageUrl,
        fullName: fullName,
    });
    newUserId = res.body._id;
}));
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/auth/login").send({
            email: email,
            password: password,
        });
        accessToken = response.body.tokens.accessToken;
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loginUser();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    mongoose_1.default.connection.close();
}));
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
    test("get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user');
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    }));
    test("get user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user/' + newUserId).set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body._id).toEqual(newUserId);
        expect(response.body.fullName).toEqual(fullName);
    }));
    test("put user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user/' + newUserId).set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body._id).toEqual(newUserId);
        expect(response.body.fullName).toEqual(fullName);
    }));
});
//# sourceMappingURL=user.test.js.map