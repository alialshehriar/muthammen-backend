/**
 * Generate a unique referral code using Base62 encoding
 * Format: 8 characters (alphanumeric)
 */
export function generateReferralCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const combined = timestamp + random;
  
  let code = '';
  let num = combined;
  
  while (num > 0 && code.length < 8) {
    code = chars[num % 62] + code;
    num = Math.floor(num / 62);
  }
  
  // Pad with random characters if needed
  while (code.length < 8) {
    code = chars[Math.floor(Math.random() * 62)] + code;
  }
  
  return code.slice(0, 8);
}

/**
 * Determine referral tier based on count
 */
export function getReferralTier(count: number): 'none' | 'bronze' | 'silver' | 'gold' | 'diamond' {
  if (count >= 50) return 'diamond';
  if (count >= 20) return 'gold';
  if (count >= 10) return 'silver';
  if (count >= 3) return 'bronze';
  return 'none';
}

