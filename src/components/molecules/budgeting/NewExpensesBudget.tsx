import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BudgetCategoryTable from './BudgetCategoryTable';
import {useEffect} from 'react';
import '@/styles/newbudgetform.css';

interface NewExpensesBudgetProps {
	expenseCategories: BudgetCategoryItem[];
	setCategories: (data: BudgetCategoryItem[]) => void;
}
const NewExpensesBudget = ({expenseCategories, setCategories}: NewExpensesBudgetProps) => {
	useEffect(() => {}, [expenseCategories]);
	return (
		<div className="new-budget-category-form">
			<h2 className="title">Define Category Budgets</h2>
			<p className="subtitle">
				Here, define how much you wish to spend based on each category
			</p>
			<BudgetCategoryTable
				propsCategories={expenseCategories}
				setPropsCategories={setCategories}
			/>
		</div>
	);
};
export default NewExpensesBudget;
