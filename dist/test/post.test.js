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
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const newPostMessage = 'This is the new test post message';
let newPostSender = '';
let newPostId = '';
let newPostImage = 'url';
const imageUrl = "url";
const fullName = "name";
let userId = '';
const newPostMessageUpdated = 'This is the update message';
const userEmail = "user1@gmail.com";
const userPassword = "12345";
let accessToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    const res = yield (0, supertest_1.default)(server_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "image": imageUrl,
        "fullName": fullName,
    });
    newPostSender = res.body._id;
}));
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        });
        accessToken = response.body.tokens.accessToken;
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loginUser();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    mongoose_1.default.connection.close();
}));
describe("Posts Tests", () => {
    test("add new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/post').set('Authorization', 'JWT ' + accessToken)
            .send({
            message: newPostMessage,
            userId: newPostSender,
            imageUrl: newPostImage
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessage);
        expect(response.body.post.sender).toEqual(newPostSender);
        newPostId = response.body.post._id;
    }));
    test("get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        console.log("hiiiiii");
        console.log(response.body);
        expect(response.body.post[0].message).toEqual(newPostMessage);
        expect(response.body.post[0].sender).toEqual(newPostSender);
    }));
    test("get post by Id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessage);
        expect(response.body.post.sender).toEqual(newPostSender);
    }));
    test("get post by wrong id fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/12345').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(400);
    }));
    test("get post by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post?sender=' + newPostSender).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post[0].message).toEqual(newPostMessage);
        expect(response.body.post[0].sender).toEqual(newPostSender);
    }));
    test("update post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
            .send({
            "message": newPostMessageUpdated,
            "sender": newPostSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessageUpdated);
        expect(response.body.post.sender).toEqual(newPostSender);
        response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessageUpdated);
        expect(response.body.post.sender).toEqual(newPostSender);
        response = yield (0, supertest_1.default)(server_1.default).put('/post/12345').set('Authorization', 'JWT ' + accessToken)
            .send({
            "message": newPostMessageUpdated,
            "sender": newPostSender
        });
        expect(response.statusCode).toEqual(400);
        response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
            .send({
            "message": newPostMessageUpdated,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.message).toEqual(newPostMessageUpdated);
        expect(response.body.post.sender).toEqual(newPostSender);
    }));
    test("delete post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).delete('/post/12345');
        expect(response.statusCode).toEqual(400);
    }));
});
//# sourceMappingURL=post.test.js.map