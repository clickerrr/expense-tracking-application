/* eslint-disable no-mixed-spaces-and-tabs */
import '../../styles/expenseAdder.css';
import { useContext, useEffect, useState } from 'react';
import Expense from '../../types/Expense';
import Category from '../../types/Category';
import CategoryListContext, { CategoryListContextProps } from '../context/CategoryListContext';

interface ExpenseAdderProps {
	onClose: () => void;
	onSubmitExpense: (expense: Expense) => void;
	documentToEdit: Expense | null | undefined;
}

const ExpenseForm = ({ onClose, onSubmitExpense, documentToEdit }: ExpenseAdderProps) => {
	const categoryContext = useContext<CategoryListContextProps | undefined>(CategoryListContext);

	const [name, setName] = useState('');
	const [amount, setAmount] = useState(0);
	const [category, setCategory] = useState<string>('');
	const [date, setDate] = useState(new Date());
	const [dateDisplay, setDateDisplay] = useState('');
	const [errorText, setErrorText] = useState('');
	const [categoryList, setCategoryList] = useState<Category[]>([]);

	useEffect(() => {
		if (documentToEdit !== undefined && documentToEdit !== null) {
			console.log('Editing element');
			const docId = documentToEdit.id;
			if (docId) {
				const currentName = documentToEdit.name;
				const currentAmount = documentToEdit.amount;
				const currentCat = documentToEdit.category;
				const currentDate = new Date(documentToEdit.date);

				currentName ? setName(currentName) : setName('');
				currentAmount ? setAmount(currentAmount) : setAmount(0);
				currentCat ? setCategory(currentCat.title) : setCategory('');
				currentDate
					? (setDate(currentDate),
					  setDateDisplay(currentDate.toISOString().substring(0, 10)))
					: null;
			}
		} else {
			setName('');
			setAmount(0);
			setCategory('');
			setDateDisplay('');
		}
	}, [documentToEdit]);

	useEffect(() => {
		setCategory('');
		if (categoryContext === undefined) {
			setCategoryList([]);
		} else {
			setCategoryList(categoryContext.categoryList);
			if (categoryContext.categoryList.length !== 0) {
				setCategory(categoryContext.categoryList[0].title);
			}
		}
	}, [categoryContext]);

	const addExpense = () => {
		if (amount === null || amount <= 0) {
			setErrorText('Please enter a valid positive number');
			return;
		}
		setErrorText('');

		if (documentToEdit !== null && documentToEdit !== undefined) {
			if (documentToEdit.id) {
				console.log('Passing edited document');
				const editedDocument: Expense = {
					id: documentToEdit.id,
					name: name,
					amount: amount,
					category: { id: 1, title: category },
					date: date,
				};
				onClose();
				onSubmitExpense(editedDocument);
				return;
			}
		}

		console.log('ADDING NEW EXPENSE IN EXPENSE ADDER');
		console.log(date);
		const categoryData: Category = {
			id: 1,
			title: category,
		};
		const newExpense: Expense = {
			id: -1,
			name: name,
			amount: amount,
			category: categoryData,
			date: date,
		};
		console.log(newExpense);

		onClose();
		onSubmitExpense(newExpense);
	};

	return (
		<div className="adder-parent">
			<div className="adder-header">
				<h3 className="header-title">
					{documentToEdit !== undefined && documentToEdit !== null
						? 'Expense Editor'
						: 'Expense Adder'}
				</h3>
				<button
					className="close-button"
					onClick={() => {
						console.log(onClose);
						onClose();
					}}
				>
					X
				</button>
			</div>
			<div className="adder-container">
				<label htmlFor="name">Name</label>
				<input
					onChange={(event) => {
						setName(event.target.value);
					}}
					type="text"
					className="form-input"
					name="name"
					value={name}
					placeholder="Name"
				></input>
				<label htmlFor="amount">
					Amount<span className="red-text">*</span>
				</label>
				<input
					onChange={(event) => {
						setAmount(Number(event.target.value));
					}}
					type="number"
					className="form-input"
					name="amount"
					value={amount}
					placeholder="Amount"
				></input>
				<label htmlFor="category">Category</label>
				<select
					className="form-input"
					onChange={(event) => {
						setCategory(event.target.value);
					}}
				>
					{categoryList.map((element: Category) => {
						return (
							<option key={element.id} value={element.title}>
								{element.title}
							</option>
						);
					})}
				</select>
				{/* <input onChange={(event) => {setCategory(event.target.value)}} type="text" className="form-input" name="category" value={category} placeholder="Category"></input> */}
				<label htmlFor="date">Date</label>
				<input
					onChange={(event) => {
						setDateDisplay(event.target.value),
							console.log(event.target.value),
							setDate(new Date(event.target.value + 'T00:00:00'));
					}}
					type="date"
					className="form-input"
					name="date"
					value={dateDisplay}
				></input>
				<label>{errorText}</label>
				<button onClick={() => addExpense()}>Submit</button>
			</div>
			<div>
				<span>* signify required fields</span>
			</div>
		</div>
	);
};

export default ExpenseForm;
