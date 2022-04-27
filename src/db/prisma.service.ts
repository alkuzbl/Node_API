import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILoggerService) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] К базе данных успешно подключились');
		} catch (err) {
			if (err instanceof Error) {
				this.logger.log(
					'[PrismaService] Ошибка подключения к базе данных:' + err.message,
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log('[PrismaService] База данных отключена');
	}
}
