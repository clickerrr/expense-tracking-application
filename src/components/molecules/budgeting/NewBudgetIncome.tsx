import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import NewBudgetCategoryTable from './NewBudgetCategoryTable';

interface NewMonthlyIncomeProps {
	incomeCategories: BudgetCategoryItem[];
	setIncomeCategories: (data: BudgetCategoryItem[]) => void;
}

const NewMonthlyIncome = ({incomeCategories, setIncomeCategories}: NewMonthlyIncomeProps) => {
	return (
		<div className="new-budget-category-form">
			<h2>Enter Expected Monthly Income</h2>
			<p>Here, enter how much money you expect to make by the end of the month.</p>
			<NewBudgetCategoryTable
				propsCategories={incomeCategories}
				setPropsCategories={setIncomeCategories}
				onRemoveElement={(data: BudgetCategoryItem) => {}}
			/>
		</div>
	);
};

export default NewMonthlyIncome;
