import { Request, Response } from 'express';
export declare const getVisitors: (req: Request, res: Response) => Promise<void>;
export declare const checkIn: (req: Request, res: Response) => Promise<void>;
export declare const checkOut: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const archiveVisitor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=visitorController.d.ts.map