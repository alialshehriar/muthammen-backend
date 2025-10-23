import { z } from 'zod';
export declare const WaitlistSignupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    referred_by: z.ZodOptional<z.ZodString>;
    honeypot: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ReferralClickSchema: z.ZodObject<{
    referral_code: z.ZodString;
}, z.core.$strip>;
export type WaitlistSignupInput = z.infer<typeof WaitlistSignupSchema>;
export type ReferralClickInput = z.infer<typeof ReferralClickSchema>;
//# sourceMappingURL=validation.d.ts.map