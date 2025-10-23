import { AppError } from './errorHandler.js';
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            const errors = error.errors?.map((e) => e.message).join(', ') || 'Validation failed';
            throw new AppError(errors, 400);
        }
    };
};
//# sourceMappingURL=validate.js.map