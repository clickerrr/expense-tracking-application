import { createContext } from 'react';
import Expense from '../../types/Expense';
export interface ExpenseListContextProps {
	expenseList: Expense[];
	updateExpenseList: (categoryList: Expense[]) => void;
}
const ExpenseListContext = createContext<ExpenseListContextProps | undefined>(undefined);
export default ExpenseListContext;
