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
const post_1 = __importDefault(require("../controllers/post"));
const request_1 = __importDefault(require("../request"));
module.exports = (io, socket) => {
    const getAllPosts = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("getAllPosts with socketId: %s", socket.id);
        try {
            const response = yield post_1.default.getAllPosts(new request_1.default(body, socket.data.user, null, null));
            socket.emit('post:get_all.response', response);
        }
        catch (err) {
            socket.emit('post:get_all.response', { 'status': 'fail' });
        }
    });
    const addNewPost = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("postAdd with socketId: %s", socket.id);
        try {
            const response = yield post_1.default.addNewPost(new request_1.default(body, socket.data.user, null, null));
            socket.emit('post:add_new.response', response);
        }
        catch (err) {
            socket.emit('post:add_new.response', { 'status': 'fail' });
        }
    });
    const getPostById = (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("getPostById with socketId: %s", socket.id);
        try {
            const response = yield post_1.default.getPostById(new request_1.default(body, socket.data.user, null, null));
            socket.emit('post:get_by_id.response', response);
        }
        catch (err) {
            socket.emit('post:get_by_id.response', { 'status': 'fail' });
        }
    });
    // const addNewPost = (payload) => {
    //     socket.emit('echo:echo', payload)
    // }
    console.log('register echo handlers');
    socket.on("post:get_all", getAllPosts);
    socket.on("post:get_by_id", getPostById);
    socket.on("post:add_new", addNewPost);
};
//# sourceMappingURL=postHandler.js.map