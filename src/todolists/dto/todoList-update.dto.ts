import { IsNumber, IsString, Length } from 'class-validator';

export class TodoListUpdateDto {
	@IsNumber()
	todoListId: number;

	@IsString()
	@Length(3, 100)
	title: string;
}
