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
const message_model_1 = __importDefault(require("../models/message_model"));
const response_1 = __importDefault(require("../response"));
const error_1 = __importDefault(require("../error"));
const getAllMessages = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let messages = {};
        if (req.query != null && req.query.sender != null) {
            console.log("if" + req.query.sender);
            messages = yield message_model_1.default.find({ sender: req.query.sender });
            console.log("this is the messages we get");
            console.log(messages);
        }
        else if (req.query != null && req.query.reciver != null) {
            console.log("else if");
            messages = yield message_model_1.default.find({ reciver: req.query.reciver });
        }
        return new response_1.default(messages, req.userId, null);
    }
    catch (err) {
        return new response_1.default(null, req.userId, new error_1.default(400, err.message));
    }
});
const addNewMessage = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = req.body["message"];
    const sender = req.userId;
    const rec = req.body["to"];
    const message = new message_model_1.default({
        body: msg,
        sender: sender,
        reciver: rec
    });
    try {
        const newMessage = yield message.save();
        return new response_1.default(newMessage, sender, null);
    }
    catch (err) {
        return new response_1.default(null, sender, new error_1.default(400, err.message));
    }
});
module.exports = { getAllMessages, addNewMessage };
//# sourceMappingURL=message.js.map