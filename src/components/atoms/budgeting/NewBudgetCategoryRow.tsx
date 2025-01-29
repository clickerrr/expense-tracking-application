import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import {useRef, useState} from 'react';

interface NewBudgetCategoryRowProps {
	onSubmit: (data: BudgetCategoryItem) => void;
	onCancel: () => void;
	errorCheck: (data: BudgetCategoryItem) => boolean;
}
const NewBudgetCategoryRow = ({onSubmit, onCancel, errorCheck}: NewBudgetCategoryRowProps) => {
	const [name, setName] = useState<string>('');
	const [plannedAmount, setPlannedAmount] = useState<number>(0);
	const [error, setError] = useState<string>('');

	const inputRef = useRef<HTMLInputElement>(null);

	const verifyUserInput = () => {
		if (name === '') {
			console.log('name', name);
			if (inputRef.current) {
				inputRef.current.style.borderColor = 'red';
			}
			return false;
		}
		setError('');
		return true;
	};

	const handleSubmit = () => {
		if (!verifyUserInput()) return;

		const newData: BudgetCategoryItem = {
			id: -1,
			title: name,
			planned: plannedAmount,
			actual: 0,
		};

		onSubmit(newData);
	};

	return (
		<>
			<tr>
				<td>
					<input
						ref={inputRef}
						placeholder="Enter name..."
						value={name}
						onChange={event => {
							setName(event.target.value);
						}}
					/>
				</td>
				<td>
					$
					<input
						className="smaller-input"
						type="number"
						onChange={event => {
							setPlannedAmount(Number(event.target.value));
						}}
						value={plannedAmount}
					/>
				</td>
				<td>
					<button onClick={() => onCancel()}>Cancel</button>
				</td>
				<td>
					<button onClick={() => handleSubmit()}>Submit</button>
				</td>
			</tr>
			{error === '' ? (
				<></>
			) : (
				<tr>
					<td>
						<p>{error}</p>
					</td>
				</tr>
			)}
		</>
	);
};
export default NewBudgetCategoryRow;
