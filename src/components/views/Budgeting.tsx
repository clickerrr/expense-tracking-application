import {useEffect, useState} from 'react';
import '@/styles/budgeting.css';
import BudgetDetails from '@/components/organisms/budgeting/BudgetDetails';
import SelectBudget from '@/components/organisms/budgeting/SelectBudget';
import BudgetCategoryTable from '../organisms/budgeting/BudgetCategoryTable';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';

const monthList = [
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

const Budgeting = () => {
	const [budgetExists, setBudgetExists] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

	// useEffect(() => {
	// 	const monthNumber = getMonthNumber(selectedMonth);
	// 	fetch(`http://127.0.0.1:3000/budgeting/create/${selectedYear}/${monthNumber}`, {
	// 		method: 'POST',
	// 	})
	// 		.then(response => {
	// 			return response.json();
	// 		})
	// 		.then(result => {
	// 			if (result === null) {
	// 				setDisplayBudget(false);
	// 			} else {
	// 				setDisplayBudget(true);
	// 			}
	// 		});
	// }, [selectedYear, selectedMonth]);

	// const handleCreateBudget = () => {
	// 	setDisplayBudget(true);
	// 	const monthNumber = getMonthNumber(selectedMonth);
	// 	fetch(`http://127.0.0.1:3000/budgeting/create/${selectedYear}/${monthNumber}`, {
	// 		method: 'POST',
	// 	})
	// 		.then(response => {
	// 			return response.json();
	// 		})
	// 		.then(result => {
	// 			console.log(result);
	// 		});
	// };

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

	const sampleData: BudgetCategoryItem[] = [
		{id: 1, title: 'Food', planned: 100, actual: 250},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 3, title: 'Other', planned: 50, actual: 100},
		{id: 1, title: 'Food', planned: 100, actual: 250},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 1, title: 'Food', planned: 100, actual: 250},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 3, title: 'Other', planned: 50, actual: 100},
		{id: 1, title: 'Food', planned: 100, actual: 250},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 1, title: 'Food', planned: 100, actual: 250},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 3, title: 'Other', planned: 50, actual: 100},
		{id: 1, title: 'Food', planned: 100, actual: 250},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
		{id: 2, title: 'Groceries', planned: 250, actual: 100},
	];

	const triggerEdit = () => {};

	return (
		<div className="parent">
			<div className="header">
				<h1>Budgeting</h1>
				{budgetExists ? <h2>{`${monthList[selectedMonth]} ${selectedYear}`}</h2> : <></>}
			</div>
			<div className="container">
				{!budgetExists ? (
					<SelectBudget
						onSubmit={() => {
							setBudgetExists(true);
						}}
						passSelectedYear={(passedYear: number) => setSelectedYear(passedYear)}
						passSelectedMonth={(passedMonth: number) => setSelectedMonth(passedMonth)}
					/>
				) : (
					<>
						<div className="category-section">
							<BudgetCategoryTable
								title={'Expenses'}
								budgetData={sampleData}
								onEdit={() => triggerEdit()}
							/>
						</div>
						<div className="category-section">
							<BudgetCategoryTable
								title={'Monthly Payments'}
								budgetData={sampleData}
								onEdit={() => triggerEdit()}
							/>
						</div>
						<div className="category-section">
							<BudgetCategoryTable
								title={'Income'}
								budgetData={sampleData}
								onEdit={() => triggerEdit()}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
export default Budgeting;
