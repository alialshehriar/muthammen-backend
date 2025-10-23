import { Router } from 'express';
import { ReferralController } from '../controllers/ReferralController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ReferralClickSchema } from '../utils/validation.js';
const router = Router();
// POST /api/referrals/click - Track referral click
router.post('/click', validate(ReferralClickSchema), asyncHandler(ReferralController.trackClick));
// GET /api/referrals/stats/:code - Get stats for a code
router.get('/stats/:code', asyncHandler(ReferralController.getStats));
// GET /api/referrals/leaderboard - Get top referrers
router.get('/leaderboard', asyncHandler(ReferralController.getLeaderboard));
// GET /api/referrals/conversion - Get conversion rate (admin)
router.get('/conversion', asyncHandler(ReferralController.getConversionRate));
export default router;
//# sourceMappingURL=referrals.js.map