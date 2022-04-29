import { ITodoListsRepository } from './todoLists.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../db/prisma.service';
import { TodoListModel } from '@prisma/client';
import { TodolistCreateDto } from './dto/todolist-create.dto';
import { TodoListUpdateDto } from './dto/todoList-update.dto';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class TodoListsRepository implements ITodoListsRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ILoggerService) private logger: ILogger,
	) {}

	async findAll(userId: number): Promise<TodoListModel[]> {
		return this.prismaService.client.todoListModel.findMany({
			where: {
				userId,
			},
		});
	}

	async create({ userId, title }: TodolistCreateDto): Promise<TodoListModel | null> {
		try {
			return this.prismaService.client.todoListModel.create({
				data: {
					userId,
					title,
				},
			});
		} catch (err: any) {
			this.logger.error(`[PRISMA]: ${err.meta.cause}`);

			return null;
		}
	}

	async delete(todoListId: number): Promise<TodoListModel | null> {
		try {
			return await this.prismaService.client.todoListModel.delete({
				where: {
					id: todoListId,
				},
			});
		} catch (err: any) {
			this.logger.error(`[PRISMA]: ${err.meta.cause}`);

			return null;
		}
	}

	async update({ title, todoListId }: TodoListUpdateDto): Promise<TodoListModel | null> {
		try {
			return await this.prismaService.client.todoListModel.update({
				where: {
					id: todoListId,
				},
				data: {
					title,
				},
			});
		} catch (err: any) {
			this.logger.error(`[PRISMA]: ${err.meta.cause}`);

			return null;
		}
	}
}
