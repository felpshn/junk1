"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const registerSchema = Yup.object().shape({
    name: Yup.string().required().min(6).max(255),
    email: Yup.string().required().min(6).email(),
    password: Yup.string().required().min(6).max(1024)
});
const loginSchema = Yup.object().shape({
    email: Yup.string().required().min(6).email(),
    password: Yup.string().required().min(6).max(1024)
});
exports.default = {
    async login(req, res) {
        try {
            await loginSchema.validate(req.body, { abortEarly: false });
            const userExists = await User_1.User.findOne({ email: req.body.email });
            if (!userExists)
                return res.status(400).send('Email is incorrect!');
            const validPassword = await bcrypt_1.default.compare(req.body.password, userExists.password);
            if (!validPassword)
                return res.status(400).send('Password is incorrect!');
            const accessToken = jsonwebtoken_1.default.sign({ _id: userExists._id }, process.env.TOKEN_SECRET);
            res.header('user-access-token', accessToken).send(accessToken);
        }
        catch (err) {
            res.status(400).send(err.errors[0]);
        }
    },
    async register(req, res) {
        try {
            await registerSchema.validate(req.body, { abortEarly: false });
            const emailExists = await User_1.User.findOne({ email: req.body.email });
            if (emailExists)
                return res.status(400).send('Email already been used!');
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(req.body.password, salt);
            const addUser = new User_1.User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });
            await addUser.save();
            res.send({ userID: addUser._id });
        }
        catch (err) {
            res.status(400).send(err.errors[0]);
        }
    },
    async show(req, res) {
        const userRequired = await User_1.User.findById(req.user._id);
        res.send(userRequired);
    }
};
