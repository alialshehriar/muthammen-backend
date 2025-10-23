import type { Request, Response } from 'express';
export declare class ReferralController {
    /**
     * POST /api/referrals/click
     * Track a referral click
     */
    static trackClick(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/referrals/stats/:code
     * Get referral stats for a specific code
     */
    static getStats(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/referrals/leaderboard
     * Get top referrers
     */
    static getLeaderboard(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/referrals/conversion
     * Get referral conversion rate (admin only)
     */
    static getConversionRate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ReferralController.d.ts.map