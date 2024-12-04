"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const property_1 = __importDefault(require("./routes/property"));
const review_1 = __importDefault(require("./routes/review"));
const mongo_conn_1 = require("./database/mongo_conn");
const chat_1 = __importDefault(require("./routes/chat"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, mongo_conn_1.run)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = 3001;
app.get('/ping', (_req, res) => {
    console.log('ping recibido correctamente');
    res.send('pinged');
});
app.use('/user', user_1.default);
app.use('/property', property_1.default);
app.use('/review', review_1.default);
app.use('/auth', auth_1.default);
const server = app.listen(PORT, () => {
    console.log('el servidor esta escuchando en el puerto ' + PORT);
});
(0, chat_1.default)(server);
