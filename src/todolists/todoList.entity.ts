export class TodoList {
	constructor(private readonly _title: string, private readonly _userId: number) {}

	get title(): string {
		return this._title;
	}

	get userId(): number {
		return this._userId;
	}
}
