import type { Request, Response } from 'express';
export declare class WaitlistController {
    /**
     * POST /api/waitlist/register
     * Register a new user to the waitlist
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/waitlist
     * Get all waitlist signups (admin only)
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/waitlist/stats
     * Get waitlist statistics (admin only)
     */
    static getStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=WaitlistController.d.ts.map