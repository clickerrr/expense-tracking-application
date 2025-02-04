import {useEffect, useState} from 'react';
import '@/styles/budgeting.css';
import SelectBudget from '@/components/organisms/budgeting/SelectBudget';
import BudgetCategoryTable from '@/components/organisms/budgeting/BudgetCategoryTable';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BalanceView from '@/components/organisms/budgeting/BalanceView';
import EditBudgetCategoryTable from '@/components/organisms/budgeting/EditBudgetCategoryTable';
import monthList from '@/components/atoms/monthList';

const Budgeting = () => {
	const [budgetExists, setBudgetExists] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
	const [editingBudget, setEditingBudget] = useState<boolean>(false);
	const [categoryToEdit, setCategoryToEdit] = useState<string>('Expenses');
	const [dataToEdit, setDataToEdit] = useState<BudgetCategoryItem[]>([]);

	const [startingBalance, setStartingBalnace] = useState<number>(0);
	const [plannedSum, setPlannedSum] = useState<number>(0);
	const [actualSum, setActualSum] = useState<number>(0);

	const [expenseData, setExpenseData] = useState<BudgetCategoryItem[]>([]);
	const [monthlyData, setMonthlyData] = useState<BudgetCategoryItem[]>([]);
	const [incomeData, setIncomeData] = useState<BudgetCategoryItem[]>([]);

	useEffect(() => {
		const today = new Date();
		console.log(today.getFullYear(), today.getMonth());
		fetch(`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${today.getMonth() + 1}`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				if (result.results.length === 0) {
					setBudgetExists(false);
				} else {
					setBudgetExists(true);
				}
			});

		fetch(
			`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${
				today.getMonth() + 1
			}/Expenses`,
		)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log('expenses result', result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const expenses = result.results.map((element: any) => {
					const newElement: BudgetCategoryItem = {
						id: element.be_id,
						title: element.cat_title,
						planned: element.be_planned_amount,
						actual: element.be_actual_amount,
					};
					return newElement;
				});
				setExpenseData(expenses);
			});

		fetch(
			`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${today.getMonth() + 1}/Income`,
		)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log('monthly result', result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const monthly = result.results.map((element: any) => {
					const newElement: BudgetCategoryItem = {
						id: element.be_id,
						title: element.cat_title,
						planned: element.be_planned_amount,
						actual: element.be_actual_amount,
					};
					return newElement;
				});
				setMonthlyData(monthly);
			});

		fetch(
			`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${
				today.getMonth() + 1
			}/Monthly`,
		)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log('income result', result);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const income = result.results.map((element: any) => {
					const newElement: BudgetCategoryItem = {
						id: element.be_id,
						title: element.cat_title,
						planned: element.be_planned_amount,
						actual: element.be_actual_amount,
					};
					return newElement;
				});
				setIncomeData(income);
			});

		fetch(
			`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${
				today.getMonth() + 1
			}/starting`,
		)
			.then(response => {
				return response.json();
			})
			.then(result => {
				setStartingBalnace(result.results.startingBalance);
			});

		fetch(
			`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${
				today.getMonth() + 1
			}/planned`,
		)
			.then(response => {
				return response.json();
			})
			.then(result => {
				setPlannedSum(result.results.plannedSum);
			});

		fetch(
			`http://127.0.0.1:3000/budgeting/${today.getFullYear()}/${today.getMonth() + 1}/actual`,
		)
			.then(response => {
				return response.json();
			})
			.then(result => {
				setActualSum(result.results.actualSum);
			});
	}, []);

	useEffect(() => {}, []);

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
								startingBalance={startingBalance}
								projectedSpending={plannedSum}
								currentSpending={actualSum}
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
