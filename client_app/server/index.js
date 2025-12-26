const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
// Exclude Stripe Webhook from global JSON parser
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan('common'));


const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.set('io', io); // Make io accessible in routes

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ADDED
const startupRoutes = require('./routes/startupRoutes');
const applicationRoutes = require('./routes/applicationRoutes'); // MIGHT DELETE IF NOT NEEDED
const messageRoutes = require('./routes/messageRoutes');
const publicRoutes = require('./routes/publicRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // ADDED
app.use('/api/startups', startupRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        console.log('Attempting to connect to Local MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venturebridge', { // Changed DB name
            // Options might not be needed in newer mongoose, but safety first
        });
        console.log('MongoDB Connected (Local)');
        startServer();
    } catch (err) {
        console.error('Local MongoDB Connection Failed:', err); // Log the actual error
        console.log('Local MongoDB failed/not found. Starting In-Memory MongoDB...');
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('MongoDB Connected (In-Memory Fallback)');
            console.log('NOTE: Data will be lost when server restarts.');
            startServer();
        } catch (fallbackErr) {
            console.error('MongoDB Connection Error:', fallbackErr);
            process.exit(1);
        }
    }
};

const startServer = () => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

connectDB();
