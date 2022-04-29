import { TodoListModel } from '@prisma/client';
import { TodolistCreateDto } from './dto/todolist-create.dto';
import { TodoListUpdateDto } from './dto/todoList-update.dto';

export interface ITodoListsRepository {
	findAll: (userId: number) => Promise<TodoListModel[]>;
	create: (tdo: TodolistCreateDto) => Promise<TodoListModel | null>;
	delete: (todolist: number) => Promise<TodoListModel | null>;
	update: (tdo: TodoListUpdateDto) => Promise<TodoListModel | null>;
}
