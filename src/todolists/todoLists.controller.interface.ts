import { NextFunction, Request, Response } from 'express';

export interface ITodoListsController {
	todolist: (req: Request, res: Response, next: NextFunction) => void;
}
