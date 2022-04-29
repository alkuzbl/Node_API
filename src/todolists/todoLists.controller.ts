import { BaseController } from '../common/base.controller';
import { ITodoListsController } from './todoLists.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';

import { NextFunction, Response, Request } from 'express';
import { ITodoListsService } from './todoLists.service.interface';
import { IUserService } from '../users/users.service.interface';
import { HttpError } from '../errors/http-error.class';
import { AuthGuard } from '../common/auth.guard';
import { ValidateMiddleware } from '../common/validate.middleware';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { TodolistCreateDto } from './dto/todolist-create.dto';
import { TodolistDeleteDto } from './dto/todolist-delete.dto';
import { TodoListUpdateDto } from './dto/todoList-update.dto';

@injectable()
export class TodoListsController extends BaseController implements ITodoListsController {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.TodoListsService) private todoListsService: ITodoListsService,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ILoggerService) private loggerService: ILogger,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.todolist,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/',
				method: 'post',
				func: this.newTodolist,
				middlewares: [new ValidateMiddleware(TodolistCreateDto), new AuthGuard()],
			},
			{
				path: '/',
				method: 'delete',
				func: this.deleteTodolist,
				middlewares: [new ValidateMiddleware(TodolistDeleteDto), new AuthGuard()],
			},
			{
				path: '/',
				method: 'put',
				func: this.updateTodolist,
				middlewares: [new ValidateMiddleware(TodoListUpdateDto), new AuthGuard()],
			},
		]);
	}

	async todolist({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		if (!userInfo) {
			return next(new HttpError(401, 'Ошибка авторизации'));
		}
		const todoLists = await this.todoListsService.getTodoLists(userInfo.id);
		this.ok(res, { todoLists });
	}

	async newTodolist(
		{ user, body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		if (!userInfo) {
			return next(new HttpError(401, 'Ошибка авторизации'));
		}

		const todoList = await this.todoListsService.createTodoList({
			userId: Number(userInfo.id),
			...body,
		});

		if (!todoList) {
			return next(new HttpError(422, 'Не корректно отправленные данные'));
		}

		this.ok(res, { todoList });
	}

	async deleteTodolist(
		{ user, body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		if (!userInfo) {
			return next(new HttpError(401, 'Ошибка авторизации'));
		}
		const deletedTodoList = await this.todoListsService.deleteTodoList(
			Number(body.todoListId),
		);
		if (!deletedTodoList) {
			return next(new HttpError(422, 'Некорректные данные'));
		}
		this.ok(res, { deletedTodoList });
	}

	async updateTodolist(
		{ user, body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		if (!userInfo) {
			return next(new HttpError(401, 'Ошибка авторизации'));
		}
		const updatedTodoList = await this.todoListsService.updateTodoList({ ...body });
		if (!updatedTodoList) {
			return next(new HttpError(422, 'Некорректные данные'));
		}
		this.ok(res, { updatedTodoList });
	}
}
