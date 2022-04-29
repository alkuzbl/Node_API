import { IsNumber } from 'class-validator';

export class TodolistDeleteDto {
	userId: number;

	@IsNumber()
	todoListId: number;
}
