import { useContext, useEffect, useState } from 'react';
import Expense from '../../types/Expense';
import '../../styles/expenseList.css';
import editLogo from '../../assets/edit-icon.svg';
import trashLogo from '../../assets/trash-icon.svg';
import ExpenseForm from './ExpenseForm';
import ExpenseListContext from '../context/ExpenseContext';

const ExpenseListView = () => {
	const monthList: string[] = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const expenseContext = useContext(ExpenseListContext);

	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [filteredList, setFilteredList] = useState<Expense[]>([]);
	const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
	const [monthFilter, setMonthFilter] = useState<number | null>(null);

	const [availableYears, setAvailableYears] = useState<number[]>([]);

	const [yearDropdownVisible, setYearDropdownVisible] = useState<boolean>(false);
	const [monthDropdownVisible, setMonthDropdownVisible] = useState<boolean>(false);

	const [expenseAdderShowing, setExpenseAdderShowing] = useState<boolean>(false);

	const [expenseEditorShowing, setExpenseEditorShowing] = useState<boolean>(false);
	const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);

	useEffect(() => {
		setExpenses([]);
		setAvailableYears([]);
		setFilteredList([]);
		if (expenseContext !== undefined) {
			const yearsList = populateAvailableYears(expenseContext.expenseList);
			setAvailableYears(yearsList);
			setExpenses(expenseContext.expenseList);
			setFilteredList(filterList(yearFilter, monthFilter, expenseContext.expenseList));
		}
	}, [expenseContext]);

	const populateAvailableYears = (listToParse: Expense[] | null): number[] => {
		if (listToParse === null) return [];
		const years: number[] = [];

		listToParse.forEach((element: Expense) => {
			const elementYear = element.date.getFullYear();
			if (!years.includes(elementYear)) {
				years.push(elementYear);
			}
		});
		return years;
	};

	const renderList = () => {
		if (filteredList === null) return;

		return filteredList.map((element: Expense, index: number) => {
			return (
				<div className="item" key={index}>
					<span className="text grow">{element.name}</span>
					<span className="text">{element.date.toLocaleDateString('en-us')}</span>
					<span className="text">{element.category.title}</span>
					<span className="text">${element.amount}</span>
					<button
						onClick={() => {
							handleUpdateExpense(index);
						}}
						className="edit-logo"
					>
						<img src={editLogo} />
					</button>
					<button
						onClick={() => {
							handleDeleteExpense(element);
						}}
						className="edit-logo"
					>
						<img src={trashLogo} />
					</button>
				</div>
			);
		});
	};

	const filterList = (
		yearFilter: number | null,
		monthFilter: number | null,
		list: Expense[] | null
	): Expense[] => {
		if (list === null || list === undefined) list = expenses;
		if (yearFilter === null) return list;

		const newList: Expense[] = [];

		list?.forEach((element: Expense) => {
			console.log('element date month', element.date.getMonth());
			console.log('monthFilter', monthFilter);
			console.log(
				'element.date.getMonth() === monthFilter',
				element.date.getMonth() === monthFilter
			);
			const yearMatch = element.date.getFullYear() === yearFilter;

			const monthMatch =
				monthFilter !== null ? element.date.getMonth() === monthFilter : true;
			console.log('monthMatch', monthMatch);
			if (yearMatch && monthMatch) {
				newList.push(element);
			}
		});

		return sortList(newList, true);
	};

	const sortList = (list: Expense[] | null, ascending: boolean) => {
		if (list === null) return [];
		const returnedList = list.sort((a, b) => {
			return ascending
				? new Date(a.date) - new Date(b.date)
				: new Date(b.date) - new Date(a.date);
		});
		return returnedList;
	};

	const handleYearButtonClick = () => {
		setYearDropdownVisible((yearDropdownVisible) => !yearDropdownVisible);
	};

	const handleMonthButtonClick = () => {
		setMonthDropdownVisible((monthDropdownVisible) => !monthDropdownVisible);
	};

	const resetYearFilter = () => {
		setYearFilter(new Date().getFullYear());
		setFilteredList(filterList(new Date().getFullYear(), monthFilter, expenses));
	};

	const resetMonthFilter = () => {
		setMonthFilter(null);
		setFilteredList(filterList(yearFilter, null, expenses));
	};

	const addNewExpense = (newExpense: Expense) => {
		newExpense.id = expenses!.length + 1;
		expenses !== null ? setExpenses([...expenses, newExpense]) : setExpenses([newExpense]);

		const returnFilteredList = filterList(yearFilter, monthFilter, [...expenses, newExpense]);
		setFilteredList(returnFilteredList);
		addNewExpenseRemote(newExpense);
	};

	const addNewExpenseRemote = async (expense: Expense) => {
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');

		fetch('http://127.0.0.1:3000/expense/add', {
			body: JSON.stringify({
				name: expense.name,
				amount: Number(expense.amount),
				date: new Date(expense.date).toISOString(),
				category: Number(expense.category.id),
			}),
			method: 'POST',
			headers: requestHeaders,
		})
			.then((response) => {
				return response.json();
			})
			.then((result) => {
				console.log(result);
				expense.id = result['ex_id'];
				console.log('expense', expense);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleUpdateExpense = (index: number) => {
		console.log('index', index);
		if (expenses !== null) {
			setExpenseToEdit(filteredList[index]);

			if (
				expenseToEdit !== null &&
				expenseToEdit !== undefined &&
				expenseToEdit.id !== filteredList[index].id
			) {
				setExpenseEditorShowing(true);
			} else {
				setExpenseEditorShowing((expenseEditorShowing) => !expenseEditorShowing);
			}
			setExpenseAdderShowing(false);
		}
	};

	const handleDeleteExpense = (expenseToDelete: Expense) => {
		const deletedFromFilterList = filteredList.filter((value) => {
			return value.id !== expenseToDelete.id;
		});

		const deletedFromExpenseList = expenses.filter((value) => {
			return value.id !== expenseToDelete.id;
		});

		setFilteredList(deletedFromFilterList);
		setExpenses(deletedFromExpenseList);
		handleDeleteExpenseRemote(expenseToDelete);
	};

	const handleDeleteExpenseRemote = (expenseToDelete: Expense) => {
		fetch(`http://127.0.0.1:3000/expense/id/${expenseToDelete.id}`, {
			method: 'DELETE',
		})
			.then((response) => {
				return response.text();
			})
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const updateExpense = (updatedExpense: Expense) => {
		const foundExpense = filteredList?.find((expense) => {
			return expense.id === updatedExpense.id;
		});

		if (foundExpense === null || foundExpense === undefined) return;

		foundExpense.amount = updatedExpense.amount;
		foundExpense.category = updatedExpense.category;
		foundExpense.date = updatedExpense.date;
		foundExpense.name = updatedExpense.name;
		const returnFilteredList = filterList(yearFilter, monthFilter, expenses);
		setFilteredList(returnFilteredList);
	};

	return (
		<div className="expense-container">
			<h3 className="expense-title">Expenses</h3>
			<div className="expense-filters">
				<div onClick={() => resetYearFilter()} className="filter">
					<span className="red-text">X</span>
					<span>{yearFilter}</span>
				</div>

				{monthFilter !== null ? (
					<div onClick={() => resetMonthFilter()} className="filter">
						<span className="red-text">X</span>
						<span>{monthList[monthFilter]}</span>
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="expense-filters-buttons">
				<button onClick={() => handleYearButtonClick()}>Year</button>
				{yearDropdownVisible ? (
					<div className={`year-dropdown`}>
						{availableYears.map((year: number, index: number) => {
							return (
								<div
									key={index}
									className="item"
									onClick={() => {
										setYearFilter(year);
										setYearDropdownVisible(
											(yearDropdownVisible) => !yearDropdownVisible
										);
										const filteredList = filterList(
											year,
											monthFilter,
											expenses
										);
										setFilteredList(filteredList);
									}}
								>
									{year}
								</div>
							);
						})}
					</div>
				) : (
					<></>
				)}
				<button onClick={() => handleMonthButtonClick()}>Month</button>
				{monthDropdownVisible ? (
					<div className={`month-dropdown`}>
						{monthList.map((month: string, index: number) => {
							return (
								<div
									key={index}
									className="item"
									onClick={() => {
										setMonthFilter(index);
										setMonthDropdownVisible(
											(monthDropdownVisible) => !monthDropdownVisible
										);
										const filteredList = filterList(
											yearFilter,
											index,
											expenses
										);
										setFilteredList(filteredList);
									}}
								>
									{month}
								</div>
							);
						})}
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="expense-list-header">
				<span>Expense Name</span>
				<span>Expense Date</span>
				<span>Expense Category</span>
				<span>Amount</span>
				<span>Options</span>
			</div>
			<div className="expense-list">{renderList()}</div>

			<button
				onClick={() => {
					setExpenseEditorShowing(false);
					setExpenseAdderShowing(true);
				}}
				className="new-expense-button"
			>
				Add New Expense
			</button>
			{expenseAdderShowing ? (
				<ExpenseForm
					onClose={() =>
						setExpenseAdderShowing((expenseAdderShowing) => !expenseAdderShowing)
					}
					onSubmitExpense={(newExpense: Expense) => addNewExpense(newExpense)}
					documentToEdit={null}
				/>
			) : (
				<></>
			)}
			{expenseEditorShowing ? (
				<ExpenseForm
					onClose={() =>
						setExpenseEditorShowing((expenseEditorShowing) => !expenseEditorShowing)
					}
					onSubmitExpense={(updatedExpense: Expense) => updateExpense(updatedExpense)}
					documentToEdit={expenseToEdit}
				/>
			) : (
				<></>
			)}
		</div>
	);
};

export default ExpenseListView;
