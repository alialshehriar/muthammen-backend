import { ReferralService } from '../services/ReferralService.js';
import { AppError } from '../middleware/errorHandler.js';
export class ReferralController {
    /**
     * POST /api/referrals/click
     * Track a referral click
     */
    static async trackClick(req, res) {
        const { referral_code } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];
        const result = await ReferralService.trackClick(referral_code, ipAddress, userAgent);
        if (!result.success) {
            throw new AppError(result.error || 'Failed to track click', 400);
        }
        res.json(result);
    }
    /**
     * GET /api/referrals/stats/:code
     * Get referral stats for a specific code
     */
    static async getStats(req, res) {
        const { code } = req.params;
        const result = await ReferralService.getStats(code);
        if (!result.success) {
            throw new AppError(result.error || 'Failed to fetch stats', 404);
        }
        res.json(result);
    }
    /**
     * GET /api/referrals/leaderboard
     * Get top referrers
     */
    static async getLeaderboard(req, res) {
        const limit = parseInt(req.query.limit) || 10;
        const result = await ReferralService.getLeaderboard(limit);
        if (!result.success) {
            throw new AppError(result.error || 'Failed to fetch leaderboard', 500);
        }
        res.json(result);
    }
    /**
     * GET /api/referrals/conversion
     * Get referral conversion rate (admin only)
     */
    static async getConversionRate(req, res) {
        // Check admin password
        const adminPass = req.headers['x-admin-pass'] || req.query.admin_pass;
        if (adminPass !== process.env.ADMIN_PASS) {
            throw new AppError('Unauthorized', 401);
        }
        const result = await ReferralService.getConversionRate();
        if (!result.success) {
            throw new AppError(result.error || 'Failed to fetch conversion rate', 500);
        }
        res.json(result);
    }
}
//# sourceMappingURL=ReferralController.js.map