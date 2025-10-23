export interface WaitlistSignup {
    id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    referral_code: string;
    referred_by?: string;
    referral_count: number;
    referral_tier: 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';
    created_at: Date;
}
export interface ReferralClick {
    id: string;
    referral_code: string;
    ip_address?: string;
    user_agent?: string;
    clicked_at: Date;
}
export interface ReferralStats {
    email: string;
    name: string;
    referral_code: string;
    referral_count: number;
    referral_tier: string;
    created_at: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=index.d.ts.map