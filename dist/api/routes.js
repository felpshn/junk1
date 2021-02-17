"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = __importDefault(require("./controllers/UsersController"));
const auth_1 = require("./middlewares/auth");
const routes = express_1.Router();
routes.post('/login', UsersController_1.default.login);
routes.post('/register', UsersController_1.default.register);
routes.get('/posts', auth_1.validateSession, UsersController_1.default.show);
exports.default = routes;
