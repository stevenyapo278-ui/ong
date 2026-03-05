"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const subscriberRoutes_1 = __importDefault(require("./routes/subscriberRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/subscribers', subscriberRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
console.log('Routes registered.');
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
