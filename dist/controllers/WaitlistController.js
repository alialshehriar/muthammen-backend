import { WaitlistService } from '../services/WaitlistService.js';
import { AppError } from '../middleware/errorHandler.js';
export class WaitlistController {
    /**
     * POST /api/waitlist/register
     * Register a new user to the waitlist
     */
    static async register(req, res) {
        const result = await WaitlistService.register(req.body);
        if (!result.success) {
            throw new AppError(result.error || 'Registration failed', 400);
        }
        res.status(201).json(result);
    }
    /**
     * GET /api/waitlist
     * Get all waitlist signups (admin only)
     */
    static async getAll(req, res) {
        // Check admin password
        const adminPass = req.headers['x-admin-pass'] || req.query.admin_pass;
        if (adminPass !== process.env.ADMIN_PASS) {
            throw new AppError('Unauthorized', 401);
        }
        const result = await WaitlistService.getAll();
        if (!result.success) {
            throw new AppError(result.error || 'Failed to fetch waitlist', 500);
        }
        res.json(result);
    }
    /**
     * GET /api/waitlist/stats
     * Get waitlist statistics (admin only)
     */
    static async getStats(req, res) {
        // Check admin password
        const adminPass = req.headers['x-admin-pass'] || req.query.admin_pass;
        if (adminPass !== process.env.ADMIN_PASS) {
            throw new AppError('Unauthorized', 401);
        }
        const result = await WaitlistService.getStats();
        if (!result.success) {
            throw new AppError(result.error || 'Failed to fetch stats', 500);
        }
        res.json(result);
    }
}
//# sourceMappingURL=WaitlistController.js.map