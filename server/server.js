const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/uploads');
const path = require('path');
const { setIo } = require('./services/notificationService');

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

// Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Socket.io
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialhub';
mongoose.connect(MONGODB_URI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('SocialHub API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, io };
