"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("./server"));
const socket_server_1 = __importDefault(require("./socket_server"));
(0, socket_server_1.default)(server_1.default);
server_1.default.listen(process.env.PORT, () => {
    console.log('Server started');
});
module.exports = server_1.default;
// import app from './server'
// app.listen(process.env.PORT, () => {
//     console.log('Server started')
// })
//# sourceMappingURL=app.js.map