import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => e.message).join(', ') || 'Validation failed';
      throw new AppError(errors, 400);
    }
  };
};

