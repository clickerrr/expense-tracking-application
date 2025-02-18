import {useEffect} from 'react';
import editLogo from '@/assets/edit-icon.svg';
import trashLogo from '@/assets/trash-icon.svg';
import Expense from '@/types/Expense';

interface ExpenseListElementProps {
	element: Expense;
	handleUpdateExpense: (index: number) => void;
	handleDeleteExpense: (expenseToDelete: Expense) => void;
	deleteMode: boolean;
	index: number;
}

const ExpenseListElement = ({
	element,
	handleUpdateExpense,
	handleDeleteExpense,
	deleteMode,
	index,
}: ExpenseListElementProps) => {
	useEffect(() => {
		console.log('element color', element.category.color);
	}, [element, deleteMode, index]);

	return (
		<div className="item" style={{backgroundColor: element.category.color}} key={index}>
			<span className="text grow">{element.name}</span>
			<span className="text">{element.date.toLocaleDateString('en-us')}</span>
			<span className="text">{element.category.title}</span>
			<span className="text">${element.amount}</span>
			<div className="options">
				<button
					onClick={() => {
						handleUpdateExpense(index);
					}}
					className="edit-logo">
					<img src={editLogo} />
				</button>
				<button
					onClick={() => {
						handleDeleteExpense(element);
					}}
					className={`edit-logo ${!deleteMode ? 'disabled-button' : ''}`}
					disabled={!deleteMode}>
					<img src={trashLogo} />
				</button>
			</div>
		</div>
	);
};

export default ExpenseListElement;
