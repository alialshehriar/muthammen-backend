import { Router } from 'express';
import { WaitlistController } from '../controllers/WaitlistController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { WaitlistSignupSchema } from '../utils/validation.js';

const router: Router = Router();

// POST /api/waitlist/register - Register to waitlist
router.post(
  '/register',
  validate(WaitlistSignupSchema),
  asyncHandler(WaitlistController.register)
);

// GET /api/waitlist - Get all signups (admin)
router.get(
  '/',
  asyncHandler(WaitlistController.getAll)
);

// GET /api/waitlist/stats - Get stats (admin)
router.get(
  '/stats',
  asyncHandler(WaitlistController.getStats)
);

export default router;

