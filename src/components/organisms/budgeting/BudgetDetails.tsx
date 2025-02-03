import {useEffect} from 'react';
import '@/styles/budgetdetails.css';
import BudgetBarChart from '@/components/organisms/budgeting/BudgetBarChart';
import ExpensesCategory from '@/components/organisms/category/ExpensesCategory';
import IncomeCategory from '@/components/organisms/budgeting/IncomeCategory';
import monthList from '@/components/atoms/monthList';

interface BudgetDetailsProps {
	propsSelectedYear: number;
	propsSelectedMonth: number;
}

const BudgetDetails = ({propsSelectedYear, propsSelectedMonth}: BudgetDetailsProps) => {
	useEffect(() => {
		fetch(`http://localhost:3000/budgeting/${propsSelectedYear}/${propsSelectedMonth}`)
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log('budgeting result', result);
			});
	}, [propsSelectedYear, propsSelectedMonth]);

	const getMonthNumber = (inputMonth: string) => {
		const monthIndex = monthList.findIndex((month: string) => {
			return month === inputMonth;
		});
		return monthIndex + 1;
	};

	return (
		<div className="budget-details-parent">
			<div className="budget-details-container">
				<div className="budget-details-header">
					<h1>Monthly Budget: {monthList[propsSelectedMonth]}</h1>
					<div className="balance-overview-container">
						<div className="balance-overview">
							<span>Checking Account Balance:</span>
							<span className="green-value">Value</span>
						</div>
						<div className="balance-overview">
							<span>Savings Account Balance:</span>
							<span className="yellow-value">Value</span>
						</div>
					</div>
				</div>
				<div className="savings-movement-pane">
					<span className="pane-title">Savings Movement</span>
					<div className="details">
						<span className="savings-highlight-text green-value">+52%</span>
						<span className="savings-subtext">Increase in total savings</span>
					</div>
					<div className="details">
						<span className="savings-highlight-text green-background">$990</span>
						<span className="savings-subtext">Saved this month</span>
					</div>
				</div>
				<div className="savings-movement-pane">
					<span className="pane-title">Savings Movement</span>
					<div className="details">
						<span className="savings-highlight-text green-value">+52%</span>
						<span className="savings-subtext">Increase in total savings</span>
					</div>
					<div className="details">
						<span className="savings-highlight-text green-background">$990</span>
						<span className="savings-subtext">Saved this month</span>
					</div>
				</div>

				<BudgetBarChart
					propsTitle="Expenses"
					propsPlannedTotal={100}
					propsActualTotal={800}
				/>

				<BudgetBarChart
					propsTitle="Income"
					propsPlannedTotal={800}
					propsActualTotal={140}
				/>

				<ExpensesCategory
					propsSelectedMonth={propsSelectedMonth}
					propsSelectedYear={propsSelectedYear}
				/>

				<IncomeCategory />
			</div>
		</div>
	);
};
export default BudgetDetails;
