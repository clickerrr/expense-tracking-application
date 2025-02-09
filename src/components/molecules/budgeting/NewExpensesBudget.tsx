import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BudgetCategoryTable from './NewBudgetCategoryTable';
import {useEffect} from 'react';
import '@/styles/newbudgetform.css';
import NewBudgetCategoryTable from './NewBudgetCategoryTable';

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
			<NewBudgetCategoryTable
				propsCategories={expenseCategories}
				setPropsCategories={setCategories}
				onRemoveElement={(data: BudgetCategoryItem) => {}}
			/>
		</div>
	);
};
export default NewExpensesBudget;
