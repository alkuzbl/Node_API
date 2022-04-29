import { IsNumber, IsString, Length } from 'class-validator';

export class TodolistCreateDto {
	userId: number;

	@IsString()
	@Length(3, 100, {
		message:
			'Минимальная длина сроки менее 3х символов. Максимальная длина строки не более 100 символов',
	})
	title: string;
}
