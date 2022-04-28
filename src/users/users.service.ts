import { IUserService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '@prisma/client';
import { IUserRepository } from './users.repository.interface';

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUserRepository,
	) {}
	async createUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ password, email }: UserLoginDto): Promise<UserModel | null> {
		const existedUser = await this.usersRepository.find(email);

		if (!existedUser) {
			return null;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		if (await newUser.comparePassword(password)) {
			return existedUser;
		}

		return null;
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return await this.usersRepository.find(email);
	}
}
