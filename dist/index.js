import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import waitlistRoutes from './routes/waitlist.js';
import referralRoutes from './routes/referrals.js';
import { errorHandler } from './middleware/errorHandler.js';
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Muthammen Backend API is running',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/referrals', referralRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
// Error handler (must be last)
app.use(errorHandler);
// Start server (only if not in serverless environment)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Muthammen Backend API running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
}
export default app;
//# sourceMappingURL=index.js.map