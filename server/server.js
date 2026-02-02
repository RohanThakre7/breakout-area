const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/uploads');
const path = require('path');
const fs = require('fs');
const { setIo } = require('./services/notificationService');
const logger = require('./utils/logger');

dotenv.config();

// Ensure uploads directory exists (Only if NOT on Vercel)
const uploadsDir = path.join(__dirname, 'uploads');
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();
let server = app; // Default to app for Vercel

if (!process.env.VERCEL) {
    server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });
    setIo(io);

    // Socket.io logic (Only if NOT on Vercel)
    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.id}`);
        socket.on('join', (userId) => {
            socket.join(userId);
            logger.info(`User ${userId} joined room`);
        });
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
    });
}

// Database Connection Logic (Cached for Serverless)
let cachedDb = null;
const connectToDatabase = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breakout_area';
    logger.info('Connecting to MongoDB...');
    cachedDb = await mongoose.connect(MONGODB_URI, {
        bufferCommands: false, // Disable mongoose buffering
    });
    return cachedDb;
};

// Middleware to ensure DB connection on every request (Vercel optimization)
app.use(async (req, res, next) => {
    if (process.env.VERCEL) {
        try {
            await connectToDatabase();
            next();
        } catch (err) {
            logger.error('Database connection error:', err);
            return res.status(500).json({ error: 'Database connection failed', details: err.message });
        }
    } else {
        next();
    }
});

// Regular DB connection for non-serverless environments
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    connectToDatabase()
        .then(() => logger.info('Connected to MongoDB'))
        .catch(err => logger.error('MongoDB connection error:', err));
}

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://ui-avatars.com", "https://*.gravatar.com", "https://res.cloudinary.com"],
        },
    },
}));
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', require('./routes/messages'));
app.use('/api/upload', uploadRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production (Only if NOT on Vercel)
const distPath = path.join(__dirname, '../client/dist');
if (!process.env.VERCEL && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

// Error handling
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error', stack: err.stack });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

module.exports = app;
