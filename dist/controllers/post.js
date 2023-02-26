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
const post_model_1 = __importDefault(require("../models/post_model"));
const response_1 = __importDefault(require("../response"));
const error_1 = __importDefault(require("../error"));
// const getAllPostsEvent = async () => {
//     console.log("")
//     try {
//         const posts = await Post.find()
//         return { status: 'OK', data: posts }
//     } catch (err) {
//         return { status: 'FAIL', data: "" }
//     }
// }
const getAllPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req.query.sender == null || req.query == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ sender: req.query.sender });
        }
        return new response_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const getUserPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let posts = {}
        const posts = yield post_model_1.default.findByUserId(req.params.id);
        // if (req.query.sender == null || req.query == null) {
        //     posts = await Post.find()
        // } else {
        //     posts = await Post.find({ sender: req.query.sender })
        // }
        return new response_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.findById(req.params.id);
        return new response_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const putPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return new response_1.default(post, req.userId, null);
    }
    catch (err) {
        console.log("fail to update post in db");
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const msg = req.body["message"];
    const sender = req.body["sender"];
    const post = new post_model_1.default({
        message: msg,
        sender: sender
    });
    console.log("before try add new post");
    try {
        const newPost = yield post.save();
        console.log("save post");
        return new response_1.default(newPost, req.userId, null);
    }
    catch (err) {
        console.log("dont save post");
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
module.exports = { getAllPosts, addNewPost, getPostById, putPostById, getUserPosts };
//# sourceMappingURL=post.js.map