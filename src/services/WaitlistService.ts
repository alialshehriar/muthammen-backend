import pool from '../config/database.js';
import { generateReferralCode, getReferralTier } from '../utils/refCode.js';
import type { WaitlistSignup, ApiResponse } from '../types/index.js';
import type { WaitlistSignupInput } from '../utils/validation.js';

export class WaitlistService {
  /**
   * Register a new user to the waitlist
   */
  static async register(input: WaitlistSignupInput): Promise<ApiResponse<WaitlistSignup>> {
    const client = await pool.connect();
    
    try {
      // Bot protection: reject if honeypot is filled
      if (input.honeypot) {
        return {
          success: false,
          error: 'Invalid submission'
        };
      }

      // Check if email already exists
      const existingUser = await client.query(
        'SELECT id, email, ref_code FROM waitlist_signups WHERE email = $1',
        [input.email]
      );

      if (existingUser.rows.length > 0) {
        return {
          success: false,
          error: 'Email already registered',
          data: existingUser.rows[0]
        };
      }

      // Generate unique referral code
      let referralCode = generateReferralCode();
      let codeExists = true;
      let attempts = 0;

      while (codeExists && attempts < 10) {
        const result = await client.query(
          'SELECT id FROM waitlist_signups WHERE ref_code = $1',
          [referralCode]
        );
        codeExists = result.rows.length > 0;
        if (codeExists) {
          referralCode = generateReferralCode();
          attempts++;
        }
      }

      if (codeExists) {
        throw new Error('Failed to generate unique referral code');
      }

      // Start transaction
      await client.query('BEGIN');

      // Insert new signup
      const insertResult = await client.query(
        `INSERT INTO waitlist_signups 
         (name, email, phone, city, ref_code, referred_by, referrals_count, reward_tier)
         VALUES ($1, $2, $3, $4, $5, $6, 0, 'none')
         RETURNING *`,
        [input.name, input.email, input.phone || null, input.city || null, referralCode, input.referred_by || null]
      );

      const newSignup = insertResult.rows[0];

      // If referred by someone, update their referral count
      if (input.referred_by) {
        await client.query(
          `UPDATE waitlist_signups 
           SET referrals_count = referrals_count + 1,
               reward_tier = CASE
                 WHEN referrals_count + 1 >= 50 THEN 'diamond'
                 WHEN referrals_count + 1 >= 20 THEN 'gold'
                 WHEN referrals_count + 1 >= 10 THEN 'silver'
                 WHEN referrals_count + 1 >= 3 THEN 'bronze'
                 ELSE 'none'
               END
           WHERE ref_code = $1`,
          [input.referred_by]
        );
      }

      // Log event
      await client.query(
        `INSERT INTO events (event_type, user_email, metadata)
         VALUES ('waitlist_signup', $1, $2)`,
        [input.email, JSON.stringify({ ref_code: referralCode, referred_by: input.referred_by })]
      );

      await client.query('COMMIT');

      return {
        success: true,
        data: newSignup,
        message: 'Successfully registered to waitlist'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in WaitlistService.register:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register'
      };
    } finally {
      client.release();
    }
  }

  /**
   * Get all waitlist signups (for admin)
   */
  static async getAll(): Promise<ApiResponse<WaitlistSignup[]>> {
    try {
      const result = await pool.query(
        `SELECT * FROM waitlist_signups 
         ORDER BY created_at DESC`
      );

      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Error in WaitlistService.getAll:', error);
      return {
        success: false,
        error: 'Failed to fetch waitlist'
      };
    }
  }

  /**
   * Get waitlist stats
   */
  static async getStats(): Promise<ApiResponse<any>> {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as this_week,
          SUM(referrals_count) as total_referrals,
          COUNT(*) FILTER (WHERE reward_tier = 'diamond') as diamond_users,
          COUNT(*) FILTER (WHERE reward_tier = 'gold') as gold_users,
          COUNT(*) FILTER (WHERE reward_tier = 'silver') as silver_users,
          COUNT(*) FILTER (WHERE reward_tier = 'bronze') as bronze_users
        FROM waitlist_signups
      `);

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error in WaitlistService.getStats:', error);
      return {
        success: false,
        error: 'Failed to fetch stats'
      };
    }
  }
}

