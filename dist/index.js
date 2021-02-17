"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./api/routes"));
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.DB_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('\nDatabase connection established.'))
    .catch(err => console.error(err));
const app = express_1.default();
app.use(express_1.default.json());
app.use('/api/user', routes_1.default);
app.listen(3000, () => {
    console.log('\nServer is running.');
});
