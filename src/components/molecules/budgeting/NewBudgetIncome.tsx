import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BudgetCategoryTable from './BudgetCategoryTable';

interface NewMonthlyIncomeProps {
	incomeCategories: BudgetCategoryItem[];
	setIncomeCategories: (data: BudgetCategoryItem[]) => void;
}

const NewMonthlyIncome = ({incomeCategories, setIncomeCategories}: NewMonthlyIncomeProps) => {
	return (
		<div className="new-budget-category-form">
			<h2>Enter Expected Monthly Income</h2>
			<p>Here, enter how much money you expect to make by the end of the month.</p>
			<BudgetCategoryTable
				propsCategories={incomeCategories}
				setPropsCategories={setIncomeCategories}
			/>
		</div>
	);
};

export default NewMonthlyIncome;
