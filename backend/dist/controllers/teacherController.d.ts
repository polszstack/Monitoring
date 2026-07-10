import { Request, Response } from 'express';
export declare const getAllTeachers: (req: Request, res: Response) => Promise<void>;
export declare const getTeacher: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTeacher: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=teacherController.d.ts.map