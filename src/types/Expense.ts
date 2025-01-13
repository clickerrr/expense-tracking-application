import Category from './Category.ts';
export type Expense = {
	id: number;
	name: string | undefined;
	amount: number;
	category: Category;
	date: Date;
};

export default Expense;
