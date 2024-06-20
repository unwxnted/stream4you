import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const purifyRequest = [

    (req: Request, res: Response, next: NextFunction) => {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key]
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/'/g, '&#39;')
                    .replace(/"/g, '&quot;')
                    .replace(/;/g, '');
            }
        }

        next();
    },

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400);
        }
        next();
    }
];