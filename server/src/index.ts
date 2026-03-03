import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (required when behind reverse proxy like Easypanel/Nginx)
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs (relaxed for dev)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://cybersecurity.nodyt.com',
        'https://nodyt.com',
        'https://www.nodyt.com',
        'https://cybersecurity-web.wizy91.easypanel.host'
    ],
    credentials: true
}));

app.use(helmet({
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
app.use(morgan('dev'));
import authRoutes from './routes/auth.routes';
import trainingRoutes from './routes/training.routes';
import simulationRoutes from './routes/simulation.routes';

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/simulation', simulationRoutes);

// Routes
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
