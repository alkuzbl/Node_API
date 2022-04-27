import { IMiddleware } from '../common/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instance = plainToInstance(this.classToValidate, body);
		const errors = await validate(instance);
		if (errors.length > 0) {
			res.status(422).send(errors);
		} else {
			next();
		}
	}
}