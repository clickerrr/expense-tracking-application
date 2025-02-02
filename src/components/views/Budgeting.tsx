import {useEffect, useState} from 'react';
import '@/styles/budgeting.css';
import BudgetDetails from '@/components/organisms/budgeting/BudgetDetails';
import SelectBudget from '@/components/organisms/budgeting/SelectBudget';

const Budgeting = () => {
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

	// const getMonthNumber = (inputMonth: string) => {
	// 	const monthIndex = monthList.findIndex((month: string) => {
	// 		return month === inputMonth;
	// 	});
	// 	return monthIndex + 1;
	// };

	// const getMonthIndex = (inputMonth: string) => {
	// 	return monthList.findIndex((month: string) => {
	// 		return month === inputMonth;
	// 	});
	// };

	return (
		<div className="parent">
			<div className="header">
				<h1>Budgeting</h1>
			</div>
			<div className="container">
				{/* <div className="content">
					
					<div></div>
				</div>*/}

				<SelectBudget />
			</div>
			{/*
			{displayBudget ? (
				<BudgetDetails
					propsSelectedYear={selectedYear}
					propsSelectedMonth={getMonthIndex(selectedMonth)}
				/>
			) : (
				<div>
					<h1>No budget for this month</h1>
					<button
						onClick={() => {
							handleCreateBudget();
						}}>
						Create budget for this month
					</button>
				</div>
			)} */}
		</div>
	);
};
export default Budgeting;
