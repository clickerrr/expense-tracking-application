import {useState} from 'react';
import '@/styles/createnewbudget.css';
import CreateBudgetCategory from './CreateBudgetCategory';
import NewBudgetCategory from './NewBudgetCategory';
import NewBudgetForm from './NewBudgetForm';
import monthList from '@/components/atoms/monthList';

interface SelectBudgetProps {
	onSubmit: () => void;
	passSelectedYear: (year: number) => void;
	passSelectedMonth: (month: number) => void;
}

const SelectBudget = ({onSubmit, passSelectedYear, passSelectedMonth}: SelectBudgetProps) => {
	const [yearList, setYearList] = useState<number[]>([new Date().getFullYear()]);

	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

	const [selectedMonth, setSelectedMonth] = useState<string>(monthList[new Date().getMonth()]);

	const [showingCategories, setShowingCategories] = useState<boolean>(false);

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
		onSubmit();
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
							setSelectedMonth(monthList[Number(event.target.value)]);
						}}
						value={selectedMonth}>
						{monthList.map((month: string, index: number) => {
							return (
								<option key={index} value={index}>
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
					selectedMonth={1}
				/>
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
		</div>
	);
};

export default SelectBudget;
