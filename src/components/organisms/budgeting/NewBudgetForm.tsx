import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import {useEffect, useState} from 'react';
import '@/styles/newbudgetform.css';
import NewMonthlyBudget from '../../molecules/budgeting/NewMonthlyBudget';
import NewMonthlyIncome from '../../molecules/budgeting/NewBudgetIncome';
import NewBudgetSummaryConfirmation from '@/components/molecules/budgeting/NewBudgetSummaryConfirmation';
import NewExpensesBudget from '@/components/molecules/budgeting/NewExpensesBudget';
import monthList from '@/components/atoms/monthList';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

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
	const [startingBalance, setStartingBalance] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [submitting, setSubmitting] = useState<boolean>(false);

	const pageCount = 4;

	useEffect(() => {
		fetch('http://127.0.0.1:3000/category/all?type=Expenses')
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const parsedCategories = result.results.map((category: any) => {
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
		fetch('http://127.0.0.1:3000/category/all?type=Monthly')
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const parsedCategories = result.results.map((category: any) => {
					const newCategory: BudgetCategoryItem = {
						id: category.cat_id,
						title: category.cat_title,
						planned: 0,
						actual: 0,
					};
					return newCategory;
				});
				setMonthlyCategories(parsedCategories);
			});
		fetch('http://127.0.0.1:3000/category/all?type=Income')
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const parsedCategories = result.results.map((category: any) => {
					const newCategory: BudgetCategoryItem = {
						id: category.cat_id,
						title: category.cat_title,
						planned: 0,
						actual: 0,
					};
					return newCategory;
				});
				setIncomeCategories(parsedCategories);
			});
	}, []);

	const handleNext = () => {
		setPageNumber(pageNumber => Math.min(pageCount, pageNumber + 1));
	};

	const handlePrevious = () => {
		setPageNumber(pageNumber => Math.max(1, pageNumber - 1));
	};

	const handleDone = async () => {
		console.log('new budget selected month', selectedMonth);
		console.log('new budget selected year', selectedYear);
		console.log('expenseCategories', expenseCategories);
		console.log('monthlyCategories', monthlyCategories);
		console.log('incomeCategories', incomeCategories);

		console.log('Starting');
		setSubmitting(true);
		await remoteCreateBudget(selectedYear, selectedMonth, startingBalance);
		await remoteInsertNewCategories(selectedYear, selectedMonth, expenseCategories, 'Expenses');
		await remoteInsertNewCategories(selectedYear, selectedMonth, monthlyCategories, 'Monthly');
		await remoteInsertNewCategories(selectedYear, selectedMonth, incomeCategories, 'Income');
		console.log('Done');
		setSubmitting(false);
		onComplete();
	};

	const remoteCreateBudget = async (year: number, month: number, startingBalance: number) => {
		console.log('1');
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		const response = await fetch(
			`http://127.0.0.1:3000/budgeting/create/${year}/${month + 1}`,
			{
				method: 'POST',
				body: JSON.stringify({startingBalance: startingBalance}),
				headers: requestHeaders,
			},
		);

		const result = await response.json();
		console.log('Created budget with:', result);
	};

	const remoteInsertNewCategories = async (
		year: number,
		month: number,
		categoryList: BudgetCategoryItem[],
		categoryTitle: string,
	) => {
		console.log('2', categoryTitle);
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');

		for (let i = 0; i < categoryList.length; i++) {
			const element = categoryList[i];
			const response = await fetch(
				`http://127.0.0.1:3000/budgeting/category/${year}/${month + 1}`,
				{
					method: 'POST',
					body: JSON.stringify({
						title: element.title,
						budgetType: categoryTitle,
						plannedAmount: element.planned,
					}),
					headers: requestHeaders,
				},
			);
			const result = await response.json();
			console.log('Inserted expense with id:', result.results);
		}
		return;
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
						startingAmount={startingBalance}
						setStartingAmount={setStartingBalance}
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
				<div>
					<h2>
						New Budget for {monthList[selectedMonth]} {selectedYear}
					</h2>
				</div>
				{!submitting ? (
					<>
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
					</>
				) : (
					<LoadingSpinner textToDisplay={'Creating New Budget...'} />
				)}
			</div>
		</div>
	);
};
export default NewBudgetForm;
