import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUsersController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './db/prisma.service';
import { IUserRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { ITodoListsController } from './todolists/todoLists.controller.interface';
import { TodoListsController } from './todolists/todoLists.controller';
import { ITodoListsService } from './todolists/todoLists.service.interface';
import { TodoListsService } from './todolists/todoLists.service';
import { ITodoListsRepository } from './todolists/todoLists.repository.interface';
import { TodoListsRepository } from './todolists/todoLists.repository';

export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUsersController>(TYPES.UserController).to(UsersController);
	bind<IUserService>(TYPES.UserService).to(UsersService);
	bind<IUserRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<ITodoListsController>(TYPES.TodoListsController).to(TodoListsController);
	bind<ITodoListsService>(TYPES.TodoListsService).to(TodoListsService);
	bind<ITodoListsRepository>(TYPES.TodoListsRepository).to(TodoListsRepository);
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
