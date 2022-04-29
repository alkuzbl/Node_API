import { TodolistCreateDto } from './dto/todolist-create.dto';
import { TodoListModel } from '@prisma/client';
import { TodolistDeleteDto } from './dto/todolist-delete.dto';
import { TodoListUpdateDto } from './dto/todoList-update.dto';

export interface ITodoListsService {
	getTodoLists: (userId: number) => Promise<TodoListModel[] | null>;
	createTodoList: (dto: TodolistCreateDto) => Promise<TodoListModel | null>;
	deleteTodoList: (todoListId: number) => Promise<TodoListModel | null>;
	updateTodoList: (dto: TodoListUpdateDto) => Promise<TodoListModel | null>;
}
