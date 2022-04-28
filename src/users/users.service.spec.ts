import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUserRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container
		.bind<IUserRepository>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUserRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser ', async () => {
		configService.get = jest.fn().mockReturnValue('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'jestTest@test.ru',
			name: 'Test',
			password: '123456789',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.name).toEqual('jestTest@test.ru');
		expect(createdUser?.password).not.toEqual('123456789');
	});

	it('validateUser - success ', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: 'jestTest@test.ru',
			password: '123456789',
		});

		expect(res).toEqual(createdUser);
	});

	it('validateUser - wrong password ', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: 'jestTest@test.ru',
			password: '1234567890',
		});

		expect(res).toBeNull();
	});

	it('validateUser - wrong user (not find user) ', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await usersService.validateUser({
			email: 'test@test.ru',
			password: '',
		});

		expect(res).toBeNull();
	});
});
