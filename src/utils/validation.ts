import { z } from 'zod';

export const WaitlistSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  city: z.string().optional(),
  referred_by: z.string().optional(),
  honeypot: z.string().optional(), // Bot protection
});

export const ReferralClickSchema = z.object({
  ref_code: z.string().min(1, 'Referral code is required'),
});

export type WaitlistSignupInput = z.infer<typeof WaitlistSignupSchema>;
export type ReferralClickInput = z.infer<typeof ReferralClickSchema>;

