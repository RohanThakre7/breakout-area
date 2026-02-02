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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

setIo(io);

// Socket.io logic
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

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    logger.error('CRITICAL: MONGODB_URI is not defined in process.env');
} else {
    logger.info(`Attempting to connect to database: ${MONGODB_URI.substring(0, 15)}...`);
    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
        .then(() => logger.info('Connected to MongoDB Successfully'))
        .catch(err => {
            logger.error('CRITICAL: MongoDB connection error:', err);
            logger.error(`Failed URI: ${MONGODB_URI.substring(0, 15)}...`);
        });
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', require('./routes/messages'));
app.use('/api/upload', uploadRoutes);

// Static files (for production)
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SPA Fallback
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        if (fs.existsSync(path.join(distPath, 'index.html'))) {
            res.sendFile(path.join(distPath, 'index.html'));
        } else {
            res.status(404).send('Frontend build not found');
        }
    }
});

// Error handling
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send({
        error: 'Internal Server Error',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
