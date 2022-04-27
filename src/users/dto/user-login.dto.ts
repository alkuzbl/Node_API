import { IsEmail, IsString, Length } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Проверьте правильность введенных данных' })
	@IsString()
	email: string;

	@IsString()
	@Length(4, 15, { message: 'Проверьте длину пароля' })
	password: string;
}
