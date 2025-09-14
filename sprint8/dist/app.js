"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const appError_1 = __importDefault(require("./utils/appError"));
const socketAuth_1 = require("./middlewares/socketAuth");
const product_1 = __importDefault(require("./routes/product"));
const article_1 = __importDefault(require("./routes/article"));
const upload_1 = __importDefault(require("./routes/upload"));
const coments_1 = __importDefault(require("./routes/coments"));
const users_1 = __importDefault(require("./routes/users"));
dotenv.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
io.use(socketAuth_1.verifySocketToken);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
const filename = __filename;
const dir = path_1.default.dirname(filename);
app.use(express_1.default.static(path_1.default.join(dir, 'uploads')));
app.use('/products', product_1.default);
app.use('/articles', article_1.default);
app.use('/comments', coments_1.default);
app.use('/files', upload_1.default);
app.use('/users', users_1.default);
app.use('/', (err, req, res, next) => {
    if (err instanceof appError_1.default.AppError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
    }
    if (err.name === 'StructError' && err.failures) {
        console.error('유효성 검사 에러:', err.failures());
        return res.status(400).json({ message: '입력 형식이 올바르지 않습니다.' });
    }
    res.status(500).json({ message: err.message });
    console.log(err.message);
});
httpServer.listen(process.env.PORT || 3000, () => console.log('Server Started'));
