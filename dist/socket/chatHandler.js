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
const request_1 = __importDefault(require("../request"));
const message_1 = __importDefault(require("../controllers/message"));
module.exports = (io, socket) => {
    const sendMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('chat:send_message');
        const to = payload.to;
        const message = payload.message;
        const from = socket.data.user;
        // io.to(to).emit("chat:message", { 'to': to, 'from': from, 'message': message })
        try {
            const response = yield message_1.default.addNewMessage(new request_1.default(payload, from, null, null));
            io.to(to).emit("chat:message", {
                to: to,
                from: from,
                message: message,
                res: response,
            });
        }
        catch (err) {
            socket.emit("chat:message", { status: 'fail' });
        }
    });
    const getAllMessages = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('chat:get_all_message');
        try {
            const response = yield message_1.default.getAllMessages(new request_1.default(payload, socket.data.user, payload, null));
            io.to(socket.data.user).emit("chat:get.response", response);
        }
        catch (err) {
            socket.emit("chat:get.response", { status: 'fail' });
        }
    });
    console.log('register chat handlers');
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get", getAllMessages);
};
//# sourceMappingURL=chatHandler.js.map