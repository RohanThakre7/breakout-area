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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

setIo(io);

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

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Socket.io
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('join', (userId) => {
        socket.join(userId);
        logger.info(`User ${userId} joined room`);
    });

    socket.on('join_chat', (room) => {
        socket.join(room);
        logger.info(`User ${socket.id} joined chat room: ${room}`);
    });

    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});

if (process.env.NODE_ENV !== 'test') {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breakout_area';
    mongoose.connect(MONGODB_URI)
        .then(() => logger.info('Connected to MongoDB'))
        .catch(err => logger.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', require('./routes/messages'));
app.use('/api/upload', uploadRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        } else {
            // If it's an API route that wasn't matched
            res.status(404).send({ error: 'API endpoint not found' });
        }
    });
} else {
    app.get('/', (req, res) => {
        res.send('Breakout area API is running... (Frontend build not found)');
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

module.exports = { app, io, logger };
