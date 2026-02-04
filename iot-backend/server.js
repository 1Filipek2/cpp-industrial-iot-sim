require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const API_KEY = process.env.API_KEY;

if (!mongoURI || !API_KEY) {
    console.error('Missing environment variables!');
    process.exit(1);
}

mongoose.connect(mongoURI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => {
    console.error('Database connection error:', err);
});

const alarmSchema = new mongoose.Schema({
    sensor: String,
    value: Number,
    timestamp: { type: Date, default: Date.now },
    status: String
});

alarmSchema.index({ timestamp: -1 });
alarmSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

const Alarm = mongoose.model('Alarm', alarmSchema);

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const verifyApiKey = (req, res, next) => {
    const userKey = req.header('x-api-key');
    if (userKey && userKey === API_KEY) {
        return next();
    }
    res.status(403).json({ error: "Unauthorized" });
};

app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});

app.post('/api/alarms', limiter, verifyApiKey, async (req, res) => {
    try {
        const { sensor, value, timestamp, status } = req.body;
        const newAlarm = new Alarm({
            sensor,
            value,
            timestamp: (timestamp && !isNaN(timestamp)) ? new Date(timestamp * 1000) : new Date(),
            status
        });
        await newAlarm.save();
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
});

app.get('/api/alarms', async (req, res) => {
    try {
        const alarms = await Alarm.find()
            .sort({ timestamp: -1 })
            .limit(100)
            .lean();
        res.status(200).json(alarms);
    } catch (error) {
        res.status(500).json({ error: "failed" });
    }
});

app.delete('/api/alarms', verifyApiKey, async (req, res) => {
    try {
        const result = await Alarm.deleteMany({});
        res.status(200).json({ message: "Cleared", count: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: "failed" });
    }
});

app.get('/', (req, res) => {
    res.send('Industrial IoT API is running...');
});

app.get('/api/stats', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const stats = await Alarm.aggregate([
            { $match: { timestamp: { $gte: startOfDay } } },
            {
                $group: {
                    _id: null,
                    maxTemp: { 
                        $max: { 
                            $cond: [{ $eq: ["$sensor", "Main Boiler"] }, "$value", 0] 
                        } 
                    },
                    alertCount: { 
                        $sum: { 
                            $cond: [
                                { $in: ["$status", ["ALARM", "CRITICAL"]] }, 
                                1, 
                                0
                            ] 
                        } 
                    },
                    avgPressure: {
                        $avg: { 
                            $cond: [
                                { $in: ["$sensor", ["Main Motor", "Hydraulic Pump"]] }, 
                                "$value", 
                                null
                            ] 
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || { maxTemp: 0, alertCount: 0, avgPressure: 0 };
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "failed to fetch stats" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Port ${PORT}`);
});