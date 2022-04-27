import { IsEmail, IsString, Length } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверно указан e-mail' })
	email: string;

	@IsString()
	@Length(4, 15, { message: 'Проверьте длину пароля' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
