import type { WaitlistSignup, ApiResponse } from '../types/index.js';
import type { WaitlistSignupInput } from '../utils/validation.js';
export declare class WaitlistService {
    /**
     * Register a new user to the waitlist
     */
    static register(input: WaitlistSignupInput): Promise<ApiResponse<WaitlistSignup>>;
    /**
     * Get all waitlist signups (for admin)
     */
    static getAll(): Promise<ApiResponse<WaitlistSignup[]>>;
    /**
     * Get waitlist stats
     */
    static getStats(): Promise<ApiResponse<any>>;
}
//# sourceMappingURL=WaitlistService.d.ts.map