/* eslint-disable no-mixed-spaces-and-tabs */
import '@/styles/expenseAdder.css';
import {useContext, useEffect, useState} from 'react';
import Expense from '@/types/Expense';
import Category from '@/types/Category';
import CategoryListContext, {
	CategoryListContextProps,
} from '@/components/context/CategoryListContext';

interface ExpenseAdderProps {
	onClose: () => void;
	onSubmitExpense: (expense: Expense) => void;
	documentToEdit: Expense | null | undefined;
}

const ExpenseForm = ({onClose, onSubmitExpense, documentToEdit}: ExpenseAdderProps) => {
	const categoryContext = useContext<CategoryListContextProps | undefined>(CategoryListContext);

	const [name, setName] = useState('');
	const [amount, setAmount] = useState(0);
	const [category, setCategory] = useState<string>('');
	const [date, setDate] = useState(new Date());
	const [dateDisplay, setDateDisplay] = useState('');
	const [errorText, setErrorText] = useState('');
	const [categoryList, setCategoryList] = useState<Category[]>([]);

	useEffect(() => {
		if (categoryContext === undefined) {
			setCategoryList([]);
		} else {
			setCategoryList(categoryContext.categoryList);
			if (categoryContext.categoryList.length !== 0) {
				setCategory(categoryContext.categoryList[2].title);
			}
		}

		if (documentToEdit !== undefined && documentToEdit !== null) {
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
			setDateDisplay('');
		}
	}, [documentToEdit, categoryContext]);

	const addExpense = () => {
		if (amount === null || amount <= 0) {
			setErrorText('Please enter a valid positive number');
			return;
		}
		setErrorText('');

		const foundCategory = categoryList.find((element: Category) => {
			return element.title === category;
		});
		const categoryData: Category = {
			id: foundCategory ? foundCategory.id : -1,
			title: foundCategory ? foundCategory.title : '',
			removable: true,
			editable: true,
			color: foundCategory ? foundCategory.color : '#ffffff',
		};

		if (documentToEdit !== null && documentToEdit !== undefined) {
			if (documentToEdit.id) {
				const editedDocument: Expense = {
					id: documentToEdit.id,
					name: name,
					amount: amount,
					category: categoryData,
					date: date,
				};
				onClose();
				onSubmitExpense(editedDocument);
				return;
			}
		}

		const newExpense: Expense = {
			id: -1,
			name: name,
			amount: amount,
			category: categoryData,
			date: date,
		};

		onClose();
		onSubmitExpense(newExpense);
	};

	return (
		<div className="adder-parent">
			<div className="adder-container">
				<div className="adder-header">
					<h3 className="header-title">
						{documentToEdit !== undefined && documentToEdit !== null
							? 'Expense Editor'
							: 'Expense Adder'}
					</h3>
					<button
						className="close-button"
						onClick={() => {
							onClose();
						}}>
						X
					</button>
				</div>
				<div className="adder-content">
					<label htmlFor="name">Expense Name</label>
					<input
						onChange={event => {
							setName(event.target.value);
						}}
						type="text"
						className="form-input"
						name="name"
						value={name}
						placeholder="Enter name here..."></input>
					<label htmlFor="amount">
						Expense Amount<span className="red-text">*</span>
					</label>
					<input
						onChange={event => {
							setAmount(Number(Number(event.target.value).toFixed(2)));
						}}
						type="number"
						className="form-input"
						name="amount"
						value={amount}
						placeholder="Amount"></input>
					<label htmlFor="category">Expense Category</label>
					<select
						className="form-input"
						onChange={event => {
							setCategory(event.target.value);
						}}
						value={category}>
						{categoryList.map((element: Category) => {
							return (
								<option key={element.id} value={element.title}>
									{element.title}
								</option>
							);
						})}
					</select>
					{/* <input onChange={(event) => {setCategory(event.target.value)}} type="text" className="form-input" name="category" value={category} placeholder="Category"></input> */}
					<label htmlFor="date">Expense Date</label>
					<input
						onChange={event => {
							setDateDisplay(event.target.value),
								console.log(event.target.value),
								setDate(new Date(event.target.value + 'T00:00:00'));
						}}
						type="date"
						className="form-input"
						name="date"
						value={dateDisplay}></input>
					<label className="red-text">{errorText}</label>
					<button onClick={() => addExpense()}>Submit</button>
				</div>
				<div>
					<span className="important-notice">* signify required fields</span>
				</div>
			</div>
		</div>
	);
};

export default ExpenseForm;
