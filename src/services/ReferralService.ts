import pool from '../config/database.js';
import type { ReferralStats, ApiResponse } from '../types/index.js';

export class ReferralService {
  /**
   * Track referral click
   */
  static async trackClick(
    referralCode: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ApiResponse> {
    try {
      // Check if referral code exists
      const codeCheck = await pool.query(
        'SELECT id FROM waitlist_signups WHERE ref_code = $1',
        [referralCode]
      );

      if (codeCheck.rows.length === 0) {
        return {
          success: false,
          error: 'Invalid referral code'
        };
      }

      // Log the click
      await pool.query(
        `INSERT INTO referral_clicks (ref_code, ip_address, user_agent)
         VALUES ($1, $2, $3)`,
        [referralCode, ipAddress || null, userAgent || null]
      );

      // Log event
      await pool.query(
        `INSERT INTO events (event_type, metadata)
         VALUES ('referral_click', $1)`,
        [JSON.stringify({ ref_code: referralCode, ip: ipAddress })]
      );

      return {
        success: true,
        message: 'Click tracked successfully'
      };
    } catch (error) {
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
  static async getStats(referralCode: string): Promise<ApiResponse<ReferralStats>> {
    try {
      const result = await pool.query(
        `SELECT 
          email, name, ref_code, referrals_count, reward_tier, created_at
         FROM waitlist_signups 
         WHERE ref_code = $1`,
        [referralCode]
      );

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
    } catch (error) {
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
  static async getLeaderboard(limit: number = 10): Promise<ApiResponse<ReferralStats[]>> {
    try {
      const result = await pool.query(
        `SELECT 
          email, name, ref_code, referrals_count, reward_tier, created_at
         FROM waitlist_signups 
         WHERE referrals_count > 0
         ORDER BY referrals_count DESC, created_at ASC
         LIMIT $1`,
        [limit]
      );

      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
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
  static async getConversionRate(): Promise<ApiResponse<any>> {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(DISTINCT ref_code) as total_codes_used,
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
    } catch (error) {
      console.error('Error in ReferralService.getConversionRate:', error);
      return {
        success: false,
        error: 'Failed to fetch conversion rate'
      };
    }
  }
}

