import { useEffect, useState } from 'react';
import '../../styles/budgeting.css';
import BudgetDetails from '../organisms/BudgetDetails';

const Budgeting = () => {
	const [yearList, setYearList] = useState<number[]>([new Date().getFullYear()]);

	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

	useEffect(() => {}, []);

	return (
		<div className="parent">
			<div className="header">
				<h1>Budgeting</h1>
			</div>
			<div className="container">
				<div className="content">
					<select
						className="form-input"
						onChange={(event) => {
							setSelectedYear(Number(event.target.value));
						}}
						value={selectedYear}
					>
						{yearList.map((yearNumber: number, index: number) => {
							return (
								<option key={index} value={yearNumber}>
									{yearNumber}
								</option>
							);
						})}
					</select>
					<div></div>
				</div>
			</div>
			<BudgetDetails propsSelectedYear={2025} propsSelectedMonth={1} />
		</div>
	);
};
export default Budgeting;
