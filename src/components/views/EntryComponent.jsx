import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Metrics from './Metrics';
import Navbar from '../organisms/Navbar';
import Budgeting from './Budgeting';
import ExpenseListContext from '../context/ExpenseContext';
import CategoryListContext from '../context/CategoryListContext';

const EntryComponent = () => {
	const [expenseList, setExpenseList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
	useEffect(() => {
		fetch('http://127.0.0.1:3000/expense/all')
			.then((response) => {
				console.log(response);
				return response.json();
			})
			.then((result) => {
				const expenses = [];
				result.forEach((item) => {
					const newExpense = {
						id: item['ex_id'],
						name: item['ex_name'],
						amount: item['ex_amount'],
						date: new Date(item['ex_date']),
						category: {
							id: item['cat_id'],
							title: item['cat_title'],
							removable: item['cat_removable'],
							editable: item['cat_editable'],
							color: item['cat_color'],
						},
					};
					expenses.push(newExpense);
				});
				console.log('expenses', expenses);
				setExpenseList(expenses);
			});

		fetch('http://127.0.0.1:3000/category/all')
			.then((response) => {
				console.log(response);
				return response.json();
			})
			.then((result) => {
				const categories = [];
				result.forEach((item) => {
					const newCategory = {
						id: item['cat_id'],
						title: item['cat_title'],
						removable: item['cat_removable'],
						editable: item['cat_editable'],
						color: item['cat_color'],
					};
					categories.push(newCategory);
				});
				console.log('categories', categories);
				setCategoryList(categories);
			});
	}, []);

	const updateCategoryList = (newCategoryList) => {
		setCategoryList(newCategoryList);
	};

	const updateExpenseList = (newExpenseList) => {
		setExpenseList(newExpenseList);
	};

	return (
		<ExpenseListContext.Provider
			value={{ expenseList: expenseList, updateExpenseList: updateExpenseList }}
		>
			<CategoryListContext.Provider
				value={{ categoryList: categoryList, updateCategoryList: updateCategoryList }}
			>
				<BrowserRouter>
					<Navbar />
					<Routes>
						<Route index element={<Dashboard />} />
						<Route path="/metrics" element={<Metrics />} />
						<Route path="/budgeting" element={<Budgeting />} />
					</Routes>
				</BrowserRouter>
			</CategoryListContext.Provider>
		</ExpenseListContext.Provider>
	);
};

export default EntryComponent;
