import BudgetCategoryTable from '@/components/molecules/budgeting/BudgetCategoryTable';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import {useState} from 'react';

interface NewMonthlyBudgetProps {
	monthlyCategories: BudgetCategoryItem[];
	setMonthlyCategories: (data: BudgetCategoryItem[]) => void;
}

const NewMonthlyBudget = ({monthlyCategories, setMonthlyCategories}: NewMonthlyBudgetProps) => {
	return (
		<div className="new-budget-category-form">
			<h2>Enter Monthly Payments</h2>
			<p>Enter the payments you typically would expect to pay on monthly basis.</p>
			<BudgetCategoryTable
				propsCategories={monthlyCategories}
				setPropsCategories={setMonthlyCategories}
			/>
		</div>
	);
};

export default NewMonthlyBudget;
