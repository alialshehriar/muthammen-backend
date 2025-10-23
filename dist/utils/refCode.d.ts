/**
 * Generate a unique referral code using Base62 encoding
 * Format: 8 characters (alphanumeric)
 */
export declare function generateReferralCode(): string;
/**
 * Determine referral tier based on count
 */
export declare function getReferralTier(count: number): 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';
//# sourceMappingURL=refCode.d.ts.map