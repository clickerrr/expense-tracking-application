import { useState } from 'react';
import '../../styles/newbudgetform.css';

interface NewBudgetFormProps {
	onClose: () => void;
}
const NewBudgetForm = ({ onClose }: NewBudgetFormProps) => {
	const months: string[] = [
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

	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState<number>(-1);

	return (
		<div className="newbudget-parent">
			<div className="newbudget-container">
				<div className="newbudget-header">
					<h1>New Budget</h1>
					<button
						onClick={() => {
							onClose();
						}}
					>
						Close
					</button>
				</div>
				<div className="newbudget-content">
					<label>Enter Year</label>
					<input
						type="number"
						placeholder="Enter year"
						value={selectedYear}
						onChange={(event) => setSelectedYear(Number(event.target.value))}
						min={new Date().getFullYear()}
					/>
					<label>Select Month</label>
					<select
						onChange={(event) => {
							setSelectedMonth(Number(event.target.value));
						}}
					>
						{months.map((month: string, index: number) => {
							return (
								<option key={index} value={index}>
									{month}
								</option>
							);
						})}
					</select>
					<button>Submit</button>
				</div>
			</div>
		</div>
	);
};
export default NewBudgetForm;
