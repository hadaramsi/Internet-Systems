"use strict";
// import dotenv from 'dotenv'
// if (process.env.NODE_ENV == 'test') {
//     dotenv.config({ path: './.testenv' })
// } else {
//     dotenv.config()
// }
// import express from 'express'
// const app = express()
// import http from 'http';
// const server = http.createServer(app);
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// import bodyParser from 'body-parser'
// app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
// app.use(bodyParser.json())
// import mongoose from "mongoose"
// mongoose.connect(process.env.DATABASE_URL) //,{useNewUrlParser:true})
// const db = mongoose.connection
// db.on('error', error => { console.error(error) })
// db.once('open', () => { console.log('connected to mongo DB') })
// app.use(express.static("public"));
// app.use('/uploads', express.static('uploads'))
// import postRouter from './route/post_route.js'
// app.use('/post', postRouter)
// import authRouter from './route/auth_route.js'
// app.use('/auth', authRouter)
// import swaggerUI from "swagger-ui-express"
// import swaggerJsDoc from "swagger-jsdoc"
// if (process.env.NODE_ENV == "development") {
//     const options = {
//         definition: {
//             openapi: "3.0.0",
//             info: {
//                 title: "Web Dev 2022 REST API-Hadar",
//                 version: "1.0.0",
//                 description: "REST server including authentication using JWT",
//             },
//             servers: [{ url: "http://localhost:3000", },],
//         },
//         apis: ["./src/route/*.ts"],
//     };
//     const specs = swaggerJsDoc(options);
//     app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// }
// export = server
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV == 'test') {
    dotenv_1.default.config({ path: './.testenv' });
}
else {
    dotenv_1.default.config();
}
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(body_parser_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL); //,{useNewUrlParser:true})
const db = mongoose_1.default.connection;
db.on('error', error => { console.error(error); });
db.once('open', () => { console.log('connected to mongo DB'); });
app.use('/public', express_1.default.static('public'));
app.use('/uploads', express_1.default.static('uploads'));
const auth_route_js_1 = __importDefault(require("./route/auth_route.js"));
app.use('/auth', auth_route_js_1.default);
const post_route_js_1 = __importDefault(require("./route/post_route.js"));
app.use('/post', post_route_js_1.default);
const user_route_js_1 = __importDefault(require("./route/user_route.js"));
app.use('/student', user_route_js_1.default);
const file_route_js_1 = __importDefault(require("./route/file_route.js"));
app.use('/file', file_route_js_1.default);
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000", },],
        },
        apis: ["./src/route/*.ts"],
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
}
module.exports = server;
//# sourceMappingURL=server.js.map