import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare const getTodayAttendance: (req: Request, res: Response) => Promise<void>;
export declare const getAttendanceByDate: (req: Request, res: Response) => Promise<void>;
export declare const verifyPresent: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAttendance: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const bulkMarkAttendance: (req: any, res: Response) => Promise<void>;
export declare const toggleArchive: (req: Request, res: Response) => Promise<void>;
export declare const bulkArchive: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=attendanceController.d.ts.map