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
const user_model_1 = __importDefault(require("../models/user_model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getAllUsers');
    try {
        let users = {};
        users = yield user_model_1.default.find();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send({ 'error': "fail to get user from db" });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const users = yield user_model_1.default.findById(req.params.id);
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send({ 'error': "fail to get users from db" });
    }
});
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const user = new user_model_1.default({
        _email: req.body._email,
        password: req.body.password,
        fullName: req.body.fullName,
        image: req.body.image,
    });
    try {
        const newUser = yield user.save();
        console.log("save user in db");
        res.status(200).send(newUser);
    }
    catch (err) {
        console.log("fail to save user in db " + err);
        res.status(400).send({ 'error': 'fail adding new user to db' });
    }
});
module.exports = { getAllUsers, getUserById, addNewUser };
//# sourceMappingURL=user.js.map