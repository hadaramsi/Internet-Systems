"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(body_parser_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL); //, { useNewUrlParser: true })
const db = mongoose_1.default.connection;
db.on('error', error => { console.error(error); });
db.once('open', () => { console.log('connected to mongo DB'); });
const post_route_js_1 = __importDefault(require("./route/post_route.js"));
app.use('/post', post_route_js_1.default);
const auth_route_js_1 = __importDefault(require("./route/auth_route.js"));
app.use('/auth', auth_route_js_1.default);
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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
if (process.env.NODE_ENV == "development") {
    // const swaggerUI = require("swagger-ui-express")
    // const swaggerJsDoc = require("swagger-jsdoc")
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API-Hadar",
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
module.exports = app;
//# sourceMappingURL=server.js.map