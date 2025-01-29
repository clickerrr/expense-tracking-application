import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import {useEffect, useState} from 'react';
import '@/styles/newbudgetform.css';
import NewMonthlyBudget from '../../molecules/budgeting/NewMonthlyBudget';
import NewMonthlyIncome from '../../molecules/budgeting/NewBudgetIncome';
import NewBudgetSummaryConfirmation from '@/components/molecules/budgeting/NewBudgetSummaryConfirmation';
import NewExpensesBudget from '@/components/molecules/budgeting/NewExpensesBudget';

interface NewBudgetFormProps {
	selectedYear: number;
	selectedMonth: number;
	onCancel: () => void;
	onComplete: () => void;
}

const NewBudgetForm = ({selectedYear, selectedMonth, onCancel, onComplete}: NewBudgetFormProps) => {
	const [expenseCategories, setExpenseCategories] = useState<BudgetCategoryItem[]>([]);
	const [monthlyCategories, setMonthlyCategories] = useState<BudgetCategoryItem[]>([]);
	const [incomeCategories, setIncomeCategories] = useState<BudgetCategoryItem[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);

	const pageCount = 4;

	useEffect(() => {
		fetch('http://127.0.0.1:3000/category/all')
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const parsedCategories = result.map((category: any) => {
					const newCategory: BudgetCategoryItem = {
						id: category.cat_id,
						title: category.cat_title,
						planned: 0,
						actual: 0,
					};
					return newCategory;
				});
				setExpenseCategories(parsedCategories);
			});
	}, []);

	const handleNext = () => {
		setPageNumber(pageNumber => Math.min(pageCount, pageNumber + 1));
	};

	const handlePrevious = () => {
		setPageNumber(pageNumber => Math.max(1, pageNumber - 1));
	};

	const handleDone = () => {
		onComplete();
	};

	const renderPage = () => {
		switch (pageNumber) {
			case 1:
				return (
					<NewExpensesBudget
						expenseCategories={expenseCategories}
						setCategories={setExpenseCategories}
					/>
				);

			case 2:
				return (
					<NewMonthlyBudget
						monthlyCategories={monthlyCategories}
						setMonthlyCategories={setMonthlyCategories}
					/>
				);

			case 3:
				return (
					<NewMonthlyIncome
						incomeCategories={incomeCategories}
						setIncomeCategories={setIncomeCategories}
					/>
				);
			case 4:
				return (
					<NewBudgetSummaryConfirmation
						data={[expenseCategories, monthlyCategories, incomeCategories]}
						changePage={(pageNumber: number) => setPageNumber(pageNumber)}
					/>
				);
		}
	};

	return (
		<div className="new-budget-form-parent">
			<div className="new-budget-form-container">
				<div className="new-budget-progress-bar">
					<div
						className="new-budget-progress"
						style={{width: `${(pageNumber / pageCount) * 100}%`}}></div>
				</div>
				{renderPage()}
				<div className="new-budget-form-buttons">
					{pageNumber > 1 ? (
						<button
							onClick={() => {
								handlePrevious();
							}}>
							Previous
						</button>
					) : (
						<></>
					)}
					{pageNumber === 4 ? (
						<button
							onClick={() => {
								handleDone();
							}}>
							Done
						</button>
					) : (
						<button
							onClick={() => {
								handleNext();
							}}>
							Next
						</button>
					)}
				</div>
				<div className="new-budget-form-buttons">
					<button
						onClick={() => {
							onCancel();
						}}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
export default NewBudgetForm;
