import {useContext, useEffect, useState} from 'react';
import Expense from '@/types/Expense';
import '@/styles/expenseList.css';
import sortIcon from '@/assets/sort-icon.svg';
import ExpenseForm from '@/components/organisms/expenses/ExpenseForm';
import ExpenseListContext from '@/components/context/ExpenseContext';
import CategoryListContext from '@/components//context/CategoryListContext';
import ExpenseListElement from '@/components/atoms/expenses/ExpenseListElement';
import monthList from '@/components/atoms/monthList';

const ExpenseListView = () => {
	const expenseContext = useContext(ExpenseListContext);
	const categoryContext = useContext(CategoryListContext);

	// const [expenses, setExpenses] = useState<Expense[]>([]);
	const [filteredList, setFilteredList] = useState<Expense[]>([]);
	const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
	const [monthFilter, setMonthFilter] = useState<number | null>(new Date().getMonth());

	const [availableYears, setAvailableYears] = useState<number[]>([]);

	const [yearDropdownVisible, setYearDropdownVisible] = useState<boolean>(false);
	const [monthDropdownVisible, setMonthDropdownVisible] = useState<boolean>(false);

	const [expenseAdderShowing, setExpenseAdderShowing] = useState<boolean>(false);

	const [expenseEditorShowing, setExpenseEditorShowing] = useState<boolean>(false);
	const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);

	const [totalAmountSpent, setTotalAmountSpent] = useState<number>(0);

	const [filterAscending, setFilterAscending] = useState<boolean>(true);

	const [deleteMode, setDeleteMode] = useState<boolean>(false);

	useEffect(() => {
		// setExpenses([]);
		setAvailableYears([]);
		setFilteredList([]);

		if (expenseContext !== undefined && categoryContext !== undefined) {
			const yearsList = populateAvailableYears(expenseContext.expenseList);
			setAvailableYears(yearsList);
			// setExpenses(expenseContext.expenseList);
			setFilteredList(filterList(yearFilter, monthFilter, expenseContext.expenseList));
		}
	}, [expenseContext, categoryContext]);

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
				<ExpenseListElement
					key={index}
					element={element}
					handleUpdateExpense={handleUpdateExpense}
					handleDeleteExpense={handleDeleteExpense}
					deleteMode={deleteMode}
					index={index}
				/>
			);
		});
	};

	const filterList = (
		yearFilter: number | null,
		monthFilter: number | null,
		list: Expense[] | null,
	): Expense[] => {
		if (list === null || list === undefined) list = [];
		if (yearFilter === null) return list;

		const newList: Expense[] = [];

		list.forEach((element: Expense) => {
			const yearMatch = element.date.getFullYear() === yearFilter;

			const monthMatch =
				monthFilter !== null ? element.date.getMonth() === monthFilter : true;
			if (yearMatch && monthMatch) {
				newList.push(element);
			}
		});
		const totalSpent = calculateTotalAmountSpent(newList);
		setTotalAmountSpent(totalSpent);
		return sortList(newList);
	};

	const sortList = (list: Expense[] | null) => {
		if (list === null) return [];
		const returnedList = list.sort((a, b) => {
			return filterAscending
				? new Date(a.date) - new Date(b.date)
				: new Date(b.date) - new Date(a.date);
		});
		return returnedList;
	};

	const handleYearButtonClick = () => {
		setYearDropdownVisible(yearDropdownVisible => !yearDropdownVisible);
	};

	const handleMonthButtonClick = () => {
		setMonthDropdownVisible(monthDropdownVisible => !monthDropdownVisible);
	};

	const resetYearFilter = () => {
		if (expenseContext === null || expenseContext === undefined) {
			setYearFilter(new Date().getFullYear());
			setFilteredList([]);
			return;
		}
		setYearFilter(new Date().getFullYear());
		setFilteredList(
			filterList(new Date().getFullYear(), monthFilter, expenseContext.expenseList),
		);
	};

	const resetMonthFilter = () => {
		if (expenseContext === null || expenseContext === undefined) {
			setMonthFilter(null);
			setFilteredList([]);
			return;
		}
		setMonthFilter(null);
		setFilteredList(filterList(yearFilter, null, expenseContext.expenseList));
	};

	const addNewExpense = (newExpense: Expense) => {
		if (expenseContext === undefined || expenseContext === null) {
			return;
		}
		newExpense.id = expenseContext.expenseList.length + 1;
		expenseContext.expenseList !== null
			? expenseContext.updateExpenseList([...expenseContext.expenseList, newExpense])
			: expenseContext.updateExpenseList([newExpense]);

		const returnFilteredList = filterList(yearFilter, monthFilter, [
			...expenseContext.expenseList,
			newExpense,
		]);
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
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				expense.id = result['ex_id'];
				console.log('expense', expense);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleUpdateExpense = (index: number) => {
		if (expenseContext === undefined || expenseContext === null) return;
		console.log('index', index);
		if (expenseContext.expenseList !== null) {
			setExpenseToEdit(filteredList[index]);

			if (
				expenseToEdit !== null &&
				expenseToEdit !== undefined &&
				expenseToEdit.id !== filteredList[index].id
			) {
				setExpenseEditorShowing(true);
			} else {
				setExpenseEditorShowing(expenseEditorShowing => !expenseEditorShowing);
			}
			setExpenseAdderShowing(false);
		}
	};

	const handleDeleteExpense = (expenseToDelete: Expense) => {
		if (expenseContext === undefined || expenseContext.expenseList === null) return;

		const deletedFromFilterList = filteredList.filter(value => {
			return value.id !== expenseToDelete.id;
		});

		const deletedFromExpenseList = expenseContext.expenseList.filter(value => {
			return value.id !== expenseToDelete.id;
		});

		setTotalAmountSpent(calculateTotalAmountSpent(deletedFromFilterList));
		setFilteredList(deletedFromFilterList);
		expenseContext.updateExpenseList(deletedFromExpenseList);
		handleDeleteExpenseRemote(expenseToDelete);
	};

	const handleDeleteExpenseRemote = (expenseToDelete: Expense) => {
		fetch(`http://127.0.0.1:3000/expense/id/${expenseToDelete.id}`, {
			method: 'DELETE',
		})
			.then(response => {
				return response.text();
			})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const updateExpense = (updatedExpense: Expense) => {
		if (expenseContext === undefined || expenseContext.expenseList === null) return;

		const foundExpense = filteredList?.find(expense => {
			return expense.id === updatedExpense.id;
		});

		if (foundExpense === null || foundExpense === undefined) return;
		console.log('updatedExpense', updatedExpense);
		foundExpense.amount = updatedExpense.amount;
		foundExpense.category = updatedExpense.category;
		foundExpense.date = updatedExpense.date;
		foundExpense.name = updatedExpense.name;
		const returnFilteredList = filterList(yearFilter, monthFilter, expenseContext.expenseList);
		setFilteredList(returnFilteredList);
		// console.log('updatedExpense', updatedExpense);
		updateExpenseRemote(updatedExpense);
	};

	const updateExpenseRemote = (updatedExpense: Expense) => {
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');

		fetch(`http://127.0.0.1:3000/expense/id/${updatedExpense.id}`, {
			body: JSON.stringify({
				name: updatedExpense.name,
				amount: Number(updatedExpense.amount),
				date: new Date(updatedExpense.date).toISOString(),
				category: Number(updatedExpense.category.id),
			}),
			method: 'PATCH',
			headers: requestHeaders,
		})
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const calculateTotalAmountSpent = (list: Expense[]) => {
		let sum = 0;
		list.forEach((expense: Expense) => {
			sum += expense.amount;
		});
		return Number(sum.toFixed(2));
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
											yearDropdownVisible => !yearDropdownVisible,
										);

										if (expenseContext === undefined || expenseContext === null)
											return;
										const filteredList = filterList(
											year,
											monthFilter,
											expenseContext.expenseList,
										);
										setFilteredList(filteredList);
									}}>
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
											monthDropdownVisible => !monthDropdownVisible,
										);
										if (expenseContext === undefined || expenseContext === null)
											return;
										const filteredList = filterList(
											yearFilter,
											index,
											expenseContext.expenseList,
										);
										setFilteredList(filteredList);
									}}>
									{month}
								</div>
							);
						})}
					</div>
				) : (
					<></>
				)}
			</div>
			<div className="expense-list">
				<div className="expense-list-header">
					<span>Expense Name</span>

					<button
						className="date-container"
						onClick={() => {
							setFilterAscending(filterAscending => !filterAscending);
							sortList(filteredList);
						}}>
						<span>Expense Date</span>
						<img
							src={sortIcon}
							className={`sort-icon ${filterAscending ? 'rotate-icon' : ''}`}
						/>
					</button>
					<span>Expense Category</span>
					<span>Amount</span>
					<span>Options</span>
				</div>
				<div className="expense-list-body">{renderList()}</div>
			</div>

			<div className="total-amount-container">
				<span>Total Spent: ${totalAmountSpent}</span>
			</div>
			<div className="bottom-container">
				<button
					onClick={() => {
						setExpenseEditorShowing(false);
						setExpenseAdderShowing(true);
					}}
					className="new-expense-button">
					Add New Expense
				</button>
				<div className="delete-mode-container">
					<label htmlFor="delete-mode-toggler">Delete Mode</label>
					<input
						id="delete-mode-toggler"
						type="checkbox"
						name="Delete Mode"
						onChange={() => {
							setDeleteMode(deleteMode => !deleteMode);
						}}></input>
				</div>
			</div>

			{expenseAdderShowing ? (
				<ExpenseForm
					onClose={() =>
						setExpenseAdderShowing(expenseAdderShowing => !expenseAdderShowing)
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
						setExpenseEditorShowing(expenseEditorShowing => !expenseEditorShowing)
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
