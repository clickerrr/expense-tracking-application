import {useEffect, useState} from 'react';
import '@/styles/budgeting.css';
import SelectBudget from '@/components/organisms/budgeting/SelectBudget';
import BudgetCategoryTable from '@/components/organisms/budgeting/BudgetCategoryTable';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BalanceView from '@/components/organisms/budgeting/BalanceView';
import EditBudgetCategoryTable from '@/components/organisms/budgeting/EditBugetCategoryTable';
import monthList from '@/components/atoms/monthList';

const Budgeting = () => {
	const [budgetExists, setBudgetExists] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
	const [editingBudget, setEditingBudget] = useState<boolean>(false);
	const [categoryToEdit, setCategoryToEdit] = useState<string>('Expenses');
	const [dataToEdit, setDataToEdit] = useState<BudgetCategoryItem[]>([]);

	const [expenseData, setExpenseData] = useState<BudgetCategoryItem[]>([]);
	const [monthlyData, setMonthlyData] = useState<BudgetCategoryItem[]>([]);
	const [incomeData, setIncomeData] = useState<BudgetCategoryItem[]>([]);

	useEffect(() => {
		setExpenseData([
			{id: 1, title: 'Food', planned: 100, actual: 250},
			{id: 2, title: 'Groceries', planned: 250, actual: 100},
			{id: 3, title: 'Other', planned: 50, actual: 100},
			{id: 1, title: 'Food', planned: 100, actual: 250},
			{id: 2, title: 'Groceries', planned: 250, actual: 100},
			{id: 2, title: 'Groceries', planned: 250, actual: 100},
		]);
		setMonthlyData([
			{id: 1, title: 'Food', planned: 100, actual: 250},
			{id: 2, title: 'Groceries', planned: 250, actual: 100},
		]);
		setIncomeData([
			{id: 1, title: 'Food', planned: 100, actual: 250},
			{id: 2, title: 'Groceries', planned: 250, actual: 100},
			{id: 3, title: 'Other', planned: 50, actual: 100},
		]);
	}, []);

	const getMonthNumber = (inputMonth: string) => {
		const monthIndex = monthList.findIndex((month: string) => {
			return month === inputMonth;
		});
		return monthIndex + 1;
	};

	const getMonthIndex = (inputMonth: string) => {
		return monthList.findIndex((month: string) => {
			return month === inputMonth;
		});
	};

	const triggerEdit = (expenseCategoy: string) => {
		setCategoryToEdit(expenseCategoy);
		switch (expenseCategoy) {
			case 'Expenses':
				setDataToEdit(expenseData);
				break;
			case 'Monthly Payments':
				setDataToEdit(monthlyData);
				break;
			case 'Income':
				setDataToEdit(incomeData);
				break;
			default:
				console.error('Invalid expense category passed to triggerEdit');
				return;
		}
		setEditingBudget(true);
	};

	const completeEditing = (title: string, newData: BudgetCategoryItem[]) => {
		setEditingBudget(false);
		switch (title) {
			case 'Expenses':
				setExpenseData(newData);
				break;
			case 'Monthly Payments':
				setMonthlyData(newData);
				break;
			case 'Income':
				setIncomeData(newData);
				break;
			default:
				console.error('Invalid expense category passed to triggerEdit');
				return;
		}
	};

	return (
		<div className="parent">
			<div className="header">
				<h1>Budgeting</h1>
				{budgetExists ? (
					<h2 className="date-title">{`${monthList[selectedMonth]} ${selectedYear}`}</h2>
				) : (
					<></>
				)}
			</div>

			{editingBudget ? (
				<EditBudgetCategoryTable
					title={categoryToEdit}
					data={dataToEdit}
					onCompleteEditing={completeEditing}
					onCancel={() => setEditingBudget(false)}
				/>
			) : (
				<div className="container">
					{!budgetExists ? (
						<SelectBudget
							onSubmit={() => {
								setBudgetExists(true);
							}}
							passSelectedYear={(passedYear: number) => setSelectedYear(passedYear)}
							passSelectedMonth={(passedMonth: number) =>
								setSelectedMonth(passedMonth)
							}
						/>
					) : (
						<>
							<BalanceView
								startingBalance={5000}
								projectedSpending={1250}
								currentSpending={750}
							/>
							<div className="category-section">
								<BudgetCategoryTable
									title={'Expenses'}
									budgetData={expenseData}
									onEdit={triggerEdit}
								/>
							</div>
							<div className="category-section">
								<BudgetCategoryTable
									title={'Monthly Payments'}
									budgetData={monthlyData}
									onEdit={triggerEdit}
								/>
							</div>
							<div className="category-section">
								<BudgetCategoryTable
									title={'Income'}
									budgetData={incomeData}
									onEdit={triggerEdit}
								/>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};
export default Budgeting;
