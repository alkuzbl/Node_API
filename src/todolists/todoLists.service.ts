import { ITodoListsService } from './todoLists.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { ITodoListsRepository } from './todoLists.repository.interface';
import { TodoListModel } from '@prisma/client';
import { TodolistCreateDto } from './dto/todolist-create.dto';
import { TodoList } from './todoList.entity';
import { TodolistDeleteDto } from './dto/todolist-delete.dto';
import { TodoListUpdateDto } from './dto/todoList-update.dto';

@injectable()
export class TodoListsService implements ITodoListsService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.TodoListsRepository) private todoListsRepository: ITodoListsRepository,
	) {}

	async getTodoLists(userId: number): Promise<TodoListModel[] | null> {
		const todoLists = await this.todoListsRepository.findAll(userId);
		if (!todoLists) {
			return null;
		}
		return todoLists;
	}

	async createTodoList({
		userId,
		title,
	}: TodolistCreateDto): Promise<TodoListModel | null> {
		const newTodoList = new TodoList(title, userId);

		return this.todoListsRepository.create(newTodoList);
	}

	async deleteTodoList(todoListId: number): Promise<TodoListModel | null> {
		const todoList = await this.todoListsRepository.delete(todoListId);
		if (!todoList) {
			return null;
		}
		return todoList;
	}

	async updateTodoList(dto: TodoListUpdateDto): Promise<TodoListModel | null> {
		const updatedTodoList = await this.todoListsRepository.update(dto);
		if (!updatedTodoList) {
			return null;
		}
		return updatedTodoList;
	}
}
