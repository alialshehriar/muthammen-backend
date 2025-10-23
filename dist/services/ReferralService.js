import pool from '../config/database.js';
export class ReferralService {
    /**
     * Track referral click
     */
    static async trackClick(referralCode, ipAddress, userAgent) {
        try {
            // Check if referral code exists
            const codeCheck = await pool.query('SELECT id FROM waitlist_signups WHERE referral_code = $1', [referralCode]);
            if (codeCheck.rows.length === 0) {
                return {
                    success: false,
                    error: 'Invalid referral code'
                };
            }
            // Log the click
            await pool.query(`INSERT INTO referral_clicks (referral_code, ip_address, user_agent)
         VALUES ($1, $2, $3)`, [referralCode, ipAddress || null, userAgent || null]);
            // Log event
            await pool.query(`INSERT INTO events (event_type, metadata)
         VALUES ('referral_click', $1)`, [JSON.stringify({ referral_code: referralCode, ip: ipAddress })]);
            return {
                success: true,
                message: 'Click tracked successfully'
            };
        }
        catch (error) {
            console.error('Error in ReferralService.trackClick:', error);
            return {
                success: false,
                error: 'Failed to track click'
            };
        }
    }
    /**
     * Get referral stats for a specific code
     */
    static async getStats(referralCode) {
        try {
            const result = await pool.query(`SELECT 
          email, name, referral_code, referral_count, referral_tier, created_at
         FROM waitlist_signups 
         WHERE referral_code = $1`, [referralCode]);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'Referral code not found'
                };
            }
            return {
                success: true,
                data: result.rows[0]
            };
        }
        catch (error) {
            console.error('Error in ReferralService.getStats:', error);
            return {
                success: false,
                error: 'Failed to fetch stats'
            };
        }
    }
    /**
     * Get top referrers (leaderboard)
     */
    static async getLeaderboard(limit = 10) {
        try {
            const result = await pool.query(`SELECT 
          email, name, referral_code, referral_count, referral_tier, created_at
         FROM waitlist_signups 
         WHERE referral_count > 0
         ORDER BY referral_count DESC, created_at ASC
         LIMIT $1`, [limit]);
            return {
                success: true,
                data: result.rows
            };
        }
        catch (error) {
            console.error('Error in ReferralService.getLeaderboard:', error);
            return {
                success: false,
                error: 'Failed to fetch leaderboard'
            };
        }
    }
    /**
     * Get referral conversion rate
     */
    static async getConversionRate() {
        try {
            const result = await pool.query(`
        SELECT 
          COUNT(DISTINCT referral_code) as total_codes_used,
          COUNT(*) as total_clicks,
          (SELECT COUNT(*) FROM waitlist_signups WHERE referred_by IS NOT NULL) as total_conversions,
          CASE 
            WHEN COUNT(*) > 0 
            THEN ROUND((SELECT COUNT(*) FROM waitlist_signups WHERE referred_by IS NOT NULL)::numeric / COUNT(*)::numeric * 100, 2)
            ELSE 0 
          END as conversion_rate
        FROM referral_clicks
      `);
            return {
                success: true,
                data: result.rows[0]
            };
        }
        catch (error) {
            console.error('Error in ReferralService.getConversionRate:', error);
            return {
                success: false,
                error: 'Failed to fetch conversion rate'
            };
        }
    }
}
//# sourceMappingURL=ReferralService.js.map