"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Trust proxy (required when behind reverse proxy like Easypanel/Nginx)
app.set('trust proxy', 1);
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs (relaxed for dev)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);
// Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://cybersecurity.nodyt.com',
        'https://nodyt.com',
        'https://www.nodyt.com'
    ],
    credentials: true
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "www.youtube.com", "s.ytimg.com"],
            frameSrc: ["'self'", "www.youtube.com", "youtube.com"],
            imgSrc: ["'self'", "data:", "i.ytimg.com", "nodyt.com", "*.nodyt.com"],
            connectSrc: ["'self'", "www.youtube.com", "s.ytimg.com", "https://cybersecurity-api.nodyt.com", "https://cybersecurity.nodyt.com"]
        },
    },
    crossOriginEmbedderPolicy: false
}));
app.use((0, morgan_1.default)('dev'));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const training_routes_1 = __importDefault(require("./routes/training.routes"));
const simulation_routes_1 = __importDefault(require("./routes/simulation.routes"));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/training', training_routes_1.default);
app.use('/api/simulation', simulation_routes_1.default);
// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
