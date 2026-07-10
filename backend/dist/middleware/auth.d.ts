import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: string;
    };
}
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const adminOnly: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=auth.d.ts.map