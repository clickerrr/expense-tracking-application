import {useEffect, useState} from 'react';
import '@/styles/budgeting.css';
import SelectBudget from '@/components/organisms/budgeting/SelectBudget';
import BudgetCategoryTable from '@/components/organisms/budgeting/BudgetCategoryTable';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BalanceView from '@/components/organisms/budgeting/BalanceView';
import EditBudgetCategoryTable from '@/components/organisms/budgeting/EditBudgetCategoryTable';
import monthList from '@/components/atoms/monthList';
import {BASEURL, PORTNUM} from '@/constants';

const Budgeting = () => {
	const [budgetExists, setBudgetExists] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
	const [editingBudget, setEditingBudget] = useState<boolean>(false);
	const [categoryToEdit, setCategoryToEdit] = useState<string>('Expenses');
	const [dataToEdit, setDataToEdit] = useState<BudgetCategoryItem[]>([]);

	const [startingBalance, setStartingBalance] = useState<number>(0);
	const [plannedSum, setPlannedSum] = useState<number>(0);
	const [actualSum, setActualSum] = useState<number>(0);

	const [expenseData, setExpenseData] = useState<BudgetCategoryItem[]>([]);
	const [monthlyData, setMonthlyData] = useState<BudgetCategoryItem[]>([]);
	const [incomeData, setIncomeData] = useState<BudgetCategoryItem[]>([]);

	useEffect(() => {
		const today = new Date();
		console.log(today.getFullYear(), today.getMonth());

		fetchBudget(today.getFullYear(), today.getMonth());
		fetchBudgetExpenses(today.getFullYear(), today.getMonth());
	}, []);

	const fetchBudget = (year: number, month: number) => {
		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}`)
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
	};

	const fetchBudgetExpenses = (year: number, month: number) => {
		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}/Expenses`)
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

				console.log('Setting expenses data', expenses);
				setExpenseData(expenses);
			})
			.catch(error => {
				console.error(error);
			});

		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}/Monthly`)
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
				console.log('Setting monthly data', monthly);
				setMonthlyData(monthly);
			});

		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}/Income`)
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
				console.log('Setting income data', income);
				setIncomeData(income);
			});

		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}/starting`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				setStartingBalance(result.results.startingBalance);
			});

		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}/planned`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(year, month);
				console.log('SETTING PLANNED SUM', result.results.plannedSum);
				console.log(result);
				setPlannedSum(result.results.plannedSum);
			});

		fetch(`${BASEURL}:${PORTNUM}/budgeting/${year}/${month + 1}/actual`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				setActualSum(result.results.actualSum);
			});
	};

	const remoteInsertNewCategories = async (
		year: number,
		month: number,
		categoryList: BudgetCategoryItem[],
		categoryTitle: string,
	) => {
		console.log('categoryTitle', categoryTitle);
		console.log('categoryList', categoryList);
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		categoryList.forEach((element: BudgetCategoryItem) => {
			fetch(`${BASEURL}:${PORTNUM}/budgeting/category/${year}/${month + 1}`, {
				method: 'POST',
				body: JSON.stringify({
					title: element.title,
					budgetType: categoryTitle,
					plannedAmount: element.planned,
				}),
				headers: requestHeaders,
			})
				.then(response => {
					return response.json();
				})
				.then(result => {
					element.id = result.results.id;
				});
		});
	};

	const remoteUpdateCategories = async (
		year: number,
		month: number,
		categoryList: BudgetCategoryItem[],
		categoryTitle: string,
	) => {
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		categoryList.forEach((element: BudgetCategoryItem) => {
			fetch(`${BASEURL}:${PORTNUM}/budgeting/category/${year}/${month + 1}`, {
				method: 'PATCH',
				body: JSON.stringify({
					id: element.id,
					title: element.title,
					budgetType: categoryTitle,
					plannedAmount: element.planned,
					actualAmount: element.actual,
				}),
				headers: requestHeaders,
			})
				.then(response => {
					return response.json();
				})
				.then(result => {
					console.log(result.results);
					if (element.id === -1) {
						element.id = result.results.id;
					}
				});
		});
		return;
	};

	const remoteDeleteCategories = async (
		year: number,
		month: number,
		categoryList: BudgetCategoryItem[],
	) => {
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		categoryList.forEach((element: BudgetCategoryItem) => {
			fetch(`${BASEURL}:${PORTNUM}/budgeting/category/${year}/${month + 1}`, {
				method: 'DELETE',
				body: JSON.stringify({
					id: element.id,
				}),
				headers: requestHeaders,
			})
				.then(response => {
					return response.json();
				})
				.then(result => {
					console.log(result.results);
				});
		});
		return;
	};

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

	const completeEditing = (
		title: string,
		newData: BudgetCategoryItem[],
		deletedData: BudgetCategoryItem[],
	) => {
		console.log('Done editing, running');
		setEditingBudget(false);
		remoteUpdateCategories(
			selectedYear,
			selectedMonth,
			newData,
			title === 'Monthly Payments' ? 'Monthly' : title,
		).then(() => {
			remoteDeleteCategories(selectedYear, selectedMonth, deletedData).then(() => {
				fetchBudgetExpenses(selectedYear, selectedMonth);
			});
			console.log('Fetching data...');
		});

		// switch (title) {
		// 	case 'Expenses':
		// 		setExpenseData(newData);
		// 		break;
		// 	case 'Monthly Payments':
		// 		setMonthlyData(newData);
		// 		break;
		// 	case 'Income':
		// 		setIncomeData(newData);
		// 		break;
		// 	default:
		// 		console.error('Invalid expense category passed to triggerEdit');
		// 		return;
		// }
	};

	return (
		<div className="parent">
			<div className="header">
				<h1>Budgeting</h1>
				{budgetExists ? (
					<div className="sub-header">
						<h2 className="date-title">{`${monthList[selectedMonth]} ${selectedYear}`}</h2>
						<button className="button" onClick={() => setBudgetExists(false)}>
							View Different Budget
						</button>
					</div>
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
							onSubmit={(year, month) => {
								setBudgetExists(true);
								setSelectedYear(year);
								setSelectedMonth(month);
								console.log('Fetching budget right now');
								fetchBudgetExpenses(year, month);
							}}
							passSelectedYear={(passedYear: number) => setSelectedYear(passedYear)}
							passSelectedMonth={(passedMonth: number) =>
								setSelectedMonth(passedMonth)
							}
							onGoToBudget={(year: number, month: number) => {
								setSelectedYear(year);
								setSelectedMonth(month);
								fetchBudgetExpenses(year, month);
								setBudgetExists(true);
							}}
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
