import {useEffect, useState} from 'react';
import '@/styles/createnewbudget.css';
import CreateBudgetCategory from './CreateBudgetCategory';
import NewBudgetCategory from './NewBudgetCategory';
import NewBudgetForm from './NewBudgetForm';
import monthList from '@/components/atoms/monthList';

interface SelectBudgetProps {
	onSubmit: (year: number, month: number) => void;
	passSelectedYear: (year: number) => void;
	passSelectedMonth: (month: number) => void;
	onGoToBudget: (year: number, month: number) => void;
}

const SelectBudget = ({
	onSubmit,
	passSelectedYear,
	passSelectedMonth,
	onGoToBudget,
}: SelectBudgetProps) => {
	const [yearList, setYearList] = useState<number[]>([new Date().getFullYear()]);

	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

	const [selectedMonth, setSelectedMonth] = useState<string>(monthList[new Date().getMonth()]);

	const [showingCategories, setShowingCategories] = useState<boolean>(false);

	const [budgetExists, setBudgetExists] = useState<boolean>(false);

	useEffect(() => {
		const generatedYearList = generateYearList(10);
		setYearList(generatedYearList);

		fetch(`http://127.0.0.1:3000/budgeting/${selectedYear}/${getMonthNumber(selectedMonth)}`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				if (result.results.length !== 0) {
					setBudgetExists(true);
				} else {
					setBudgetExists(false);
				}
			});
	}, [onSubmit, selectedYear, selectedMonth]);

	const generateYearList = (maxBack: number) => {
		const yearList: number[] = [];
		const firstYear = new Date().getFullYear();
		yearList.push(firstYear);
		let currentYear = new Date().getFullYear() - 1;
		while (currentYear >= firstYear - maxBack) {
			yearList.push(currentYear);
			currentYear -= 1;
		}
		return yearList;
	};

	const onPressCreateBudget = () => {
		setShowingCategories(true);
	};

	const handleCancelCreateNewBudget = () => {
		setShowingCategories(false);
	};

	const handleCompleteNewBudget = () => {
		setShowingCategories(false);
		console.log('selectedMonth', selectedMonth);
		console.log('monthIndex', getMonthIndex(selectedMonth));
		passSelectedMonth(getMonthIndex(selectedMonth));
		passSelectedYear(selectedYear);
		onSubmit(selectedYear, getMonthIndex(selectedMonth));
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

	return (
		<div className="new-budget-container">
			<h1 className="new-budget-title">Select Budget</h1>
			<div className="new-budget-date-container">
				<div className="new-budget-select-container">
					<h3>Year</h3>
					<select
						className="form-input"
						onChange={event => {
							setSelectedYear(Number(event.target.value));
						}}
						value={selectedYear}>
						{yearList.map((yearNumber: number, index: number) => {
							return (
								<option key={index} value={yearNumber}>
									{yearNumber}
								</option>
							);
						})}
					</select>
				</div>
				<div className="new-budget-select-container">
					<h3>Month</h3>
					<select
						className="form-input"
						onChange={event => {
							setShowingCategories(false);
							console.log('event.target.value', event.target.value);
							setSelectedMonth(event.target.value);
						}}
						value={selectedMonth}>
						{monthList.map((month: string, index: number) => {
							return (
								<option key={index} value={month}>
									{month}
								</option>
							);
						})}
					</select>
				</div>
			</div>
			{showingCategories ? (
				<NewBudgetForm
					onCancel={() => handleCancelCreateNewBudget()}
					onComplete={() => handleCompleteNewBudget()}
					selectedYear={selectedYear}
					selectedMonth={getMonthIndex(selectedMonth)}
				/>
			) : (
				<>
					{budgetExists ? (
						<>
							<h3>Budget Found</h3>
							<button
								className="new-budget-create-button"
								onClick={() =>
									onGoToBudget(selectedYear, getMonthIndex(selectedMonth))
								}>
								View Budget
							</button>
						</>
					) : (
						<>
							<h3>No Budget Found</h3>
							<button
								onClick={() => onPressCreateBudget()}
								className="new-budget-create-button">
								Create New Budget
							</button>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default SelectBudget;
