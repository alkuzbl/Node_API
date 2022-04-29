import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';

import { UsersController } from './users/users.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './db/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { TodoListsController } from './todolists/todoLists.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UsersController,
		@inject(TYPES.TodoListsController) private todoListsController: TodoListsController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = Number(this.configService.get('PORT'));
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/todolists', this.todoListsController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost: ${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
