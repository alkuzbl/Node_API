import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'jestTest@test.ru', password: '123456789' });
		expect(res.statusCode).toBe(422);
	});

	it('login - "success"', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@test.ru', password: '1234' });

		expect(res.statusCode).toBe(200);
		expect(res.headers.authorization).not.toBeUndefined();
		expect(res.body.jwt).not.toBeUndefined();
		expect(res.body.user).toEqual({
			id: 3,
			email: 'test@test.ru',
			password: '$2a$10$TTXPAyeNifbA1YYzXVnRDuvdFnv19nCIetJ5f9aelP0C/gphhk0YG',
			name: 'test@test.ru',
		});
	});

	it('login - failed (should be statusCode 401  with an incorrect password)', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@test.ru', password: '1111' });

		expect(res.statusCode).toBe(401);
	});

	it('login - failed (should be statusCode 401  with an incorrect email)', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: '1234' });

		expect(res.statusCode).toBe(401);
	});

	it('info - "success"', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@test.ru', password: '1234' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer: ${login.body.jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.email).toBe('test@test.ru');
	});

	it('info - "error"', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer: ""`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
