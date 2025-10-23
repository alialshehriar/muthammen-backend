import type { ReferralStats, ApiResponse } from '../types/index.js';
export declare class ReferralService {
    /**
     * Track referral click
     */
    static trackClick(referralCode: string, ipAddress?: string, userAgent?: string): Promise<ApiResponse>;
    /**
     * Get referral stats for a specific code
     */
    static getStats(referralCode: string): Promise<ApiResponse<ReferralStats>>;
    /**
     * Get top referrers (leaderboard)
     */
    static getLeaderboard(limit?: number): Promise<ApiResponse<ReferralStats[]>>;
    /**
     * Get referral conversion rate
     */
    static getConversionRate(): Promise<ApiResponse<any>>;
}
//# sourceMappingURL=ReferralService.d.ts.map