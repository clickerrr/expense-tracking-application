import {useContext, useEffect, useState} from 'react';
import CategoryListContext, {
	CategoryListContextProps,
} from '@/components/context/CategoryListContext';
import Category from '@/types/Category';
import '@/styles/categoryList.css';
import editLogo from '@/assets/edit-icon.svg';
import trashLogo from '@/assets/trash-icon.svg';
import CategoryForm from '@/components/organisms/category/CategoryForm';
import ExpenseListContext, {ExpenseListContextProps} from '@/components/context/ExpenseContext';
import Expense from '@/types/Expense';

const CategoryList = () => {
	const categoryContext = useContext<CategoryListContextProps | undefined>(CategoryListContext);
	const expenseContext = useContext<ExpenseListContextProps | undefined>(ExpenseListContext);

	// const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [newCategoryLineShowing, setNewCategoryLineShowing] = useState<boolean>(false);
	const [editCategoryShowing, setEditCategoryShowing] = useState<boolean>(false);
	const [categoryToEdit, setCategoryToEdit] = useState<Category | undefined>(undefined);
	const [errorToPass, setErrorToPass] = useState<string | null>(null);
	const [swatchEditorHidden, setSwatchEditorHidden] = useState<boolean>(true);
	const [swatchEditingElement, setSwatchEditingElement] = useState<Category | undefined>(
		undefined,
	);

	useEffect(() => {}, [categoryContext?.categoryList]);

	const handleShowCategoryAdder = () => {
		if (categoryContext === undefined) return;

		setNewCategoryLineShowing(true);
	};

	const handleHideCategoryAdder = () => {
		if (categoryContext === undefined) return;

		setNewCategoryLineShowing(false);
	};

	const handleAddingNewCategory = (newCategory: Category) => {
		if (categoryContext === undefined || categoryContext === null) return;
		if (checkIfCategoryExists(newCategory)) {
			handleReopenError('Category already exists, please try again', newCategory);
			return;
		}
		handleAddNewCategoryRemote(newCategory);
		categoryContext.updateCategoryList([...categoryContext.categoryList, newCategory]);

		handleHideCategoryAdder();
	};

	const checkIfCategoryExists = (category: Category) => {
		if (categoryContext === undefined || categoryContext === null) return;
		return categoryContext.categoryList.find(element => {
			return category.title.toLowerCase() === element.title.toLowerCase();
		});
	};

	const handleAddNewCategoryRemote = (newCategory: Category) => {
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');

		fetch('http://127.0.0.1:3000/category/add', {
			body: JSON.stringify({
				title: newCategory.title,
				removable: newCategory.removable,
				editable: newCategory.editable,
				color: '#gggggg',
			}),
			method: 'POST',
			headers: requestHeaders,
		})
			.then(response => {
				return response.json();
			})
			.then(result => {
				console.log(result);
				newCategory.id = result['cat_id'];
				console.log('newcategory', newCategory);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleEditCategoryClick = () => {
		setEditCategoryShowing(true);
	};

	const updateCategory = (updatedCategory: Category) => {
		if (categoryContext === undefined || categoryContext === null) return;

		if (checkIfCategoryExists(updatedCategory)) {
			handleReopenError('Category already exists, please try again', updatedCategory);
			return;
		}
		if (categoryToEdit === undefined) return;
		let foundCategory = undefined;
		const newList = categoryContext.categoryList.map(element => {
			if (element.id === updatedCategory.id) {
				element.title = updatedCategory.title;
				foundCategory = element;
			}
			return element;
		});

		console.log('expense list in categorylist', expenseContext?.expenseList);
		if (newList === undefined || newList === null) return;
		console.log('newlist', newList);

		categoryContext.updateCategoryList(newList);
		setErrorToPass(null);
		if (foundCategory !== undefined) {
			updateCategoryRemote(foundCategory);
		}

		if (expenseContext === undefined || expenseContext === null) return;

		const newExpenseList = expenseContext.expenseList.map((element: Expense) => {
			if (element.category.id === updatedCategory.id) {
				element.category.title = updatedCategory.title;
			}
			return element;
		});
		expenseContext.updateExpenseList(newExpenseList);
	};

	const updateCategoryRemote = (category: Category) => {
		console.log(category);
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');
		const body = JSON.stringify({
			title: category.title,
			removable: category.removable ? 1 : 0,
			editable: category.editable ? 1 : 0,
			color: category.color,
		});
		console.log(body);

		fetch(`http://127.0.0.1:3000/category/${category.id}`, {
			body: body,
			method: 'PATCH',
			headers: requestHeaders,
		})
			.then(response => {
				return response.text();
			})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleReopenError = (errorMessageToPass: string, category: Category) => {
		setErrorToPass(errorMessageToPass);
		setCategoryToEdit(category);
		setNewCategoryLineShowing(false);
		setEditCategoryShowing(true);
	};

	// watch out for expenses with the category thats deleted
	const deleteCategory = (category: Category, index: number) => {
		if (categoryContext === undefined || categoryContext === null) return;

		const replacementList = categoryContext.categoryList.filter((_, i) => {
			return i !== index;
		});
		categoryContext.updateCategoryList(replacementList!);
		handleRemoteDelete(category);

		if (expenseContext === undefined) return;

		const otherCategory = categoryContext.categoryList.find((element: Category) => {
			return element.title === 'Other';
		});

		if (otherCategory === undefined) return;
		const newList = expenseContext.expenseList.map((element: Expense) => {
			if (element.category.id === category.id) {
				element.category = {...otherCategory};
			}
			return element;
		});

		expenseContext.updateExpenseList(newList);
	};

	const handleRemoteDelete = (category: Category) => {
		fetch(`http://127.0.0.1:3000/category/${category.id}`, {
			method: 'DELETE',
		})
			.then(response => {
				return response.text();
			})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const handleSwatchChange = (value: string) => {
		if (swatchEditingElement === undefined) return;
		const newElement = {...swatchEditingElement};
		newElement.color = value;

		setSwatchEditingElement(newElement);
	};

	const submitSwatchChange = () => {
		if (categoryContext === undefined || categoryContext === null) return;

		if (swatchEditingElement === undefined) return;
		console.log('Setting element');
		const foundElement = categoryContext.categoryList.find(element => {
			if (element.id === swatchEditingElement.id) {
				element.color = swatchEditingElement.color;
				return element.id === swatchEditingElement.id;
			}
		});
		if (foundElement === undefined) return;
		updateCategoryRemote(foundElement);

		categoryContext.updateCategoryList(categoryContext.categoryList);

		if (expenseContext === undefined) return;

		const newList = expenseContext.expenseList.map((element: Expense) => {
			if (element.category.id === swatchEditingElement.id) {
				element.category = {...swatchEditingElement};
			}
			return element;
		});
		expenseContext.updateExpenseList(newList);
	};

	const renderList = () => {
		if (categoryContext === undefined || categoryContext === null) return;

		return categoryContext.categoryList.map((category: Category, index: number) => {
			return (
				<div key={index} className="category-item">
					<span className="title">{category.title}</span>
					<div
						onClick={() => {
							if (swatchEditingElement !== undefined) {
								if (
									swatchEditingElement.id ===
									categoryContext.categoryList[index].id
								) {
									setSwatchEditorHidden(true);
									setSwatchEditingElement(undefined);
									return;
								}
							}
							setSwatchEditingElement(categoryContext.categoryList[index]);
							setSwatchEditorHidden(false);
						}}
						style={{backgroundColor: category.color}}
						className="color-swatch"></div>

					{category.editable ? (
						<img
							onClick={() => {
								handleEditCategoryClick();
								setCategoryToEdit(category);
							}}
							className="edit-logo"
							src={editLogo}
						/>
					) : (
						<></>
					)}
					{category.removable ? (
						<img
							onClick={() => {
								deleteCategory(category, index);
							}}
							className="edit-logo"
							src={trashLogo}
						/>
					) : (
						<></>
					)}
				</div>
			);
		});
	};

	return (
		<div className="category-container">
			<div className="title-container">
				<h3 className="category-title">Categories</h3>
				<button
					onClick={() => {
						handleShowCategoryAdder();
					}}
					className="button">
					+ Add New Category
				</button>
			</div>
			<div className="category-list">
				{renderList()}

				{newCategoryLineShowing ? (
					<CategoryForm
						onSave={updatedCategory => handleAddingNewCategory(updatedCategory)}
						onClose={() => setNewCategoryLineShowing(false)}
						categoryToEdit={undefined}
						passedError={null}
					/>
				) : (
					<></>
				)}
			</div>

			{editCategoryShowing ? (
				<CategoryForm
					onClose={() => setEditCategoryShowing(false)}
					onSave={updatedCategory => {
						setEditCategoryShowing(false);
						updateCategory(updatedCategory);
					}}
					passedError={errorToPass}
					categoryToEdit={categoryToEdit}
				/>
			) : (
				<></>
			)}
			{swatchEditorHidden ? (
				<></>
			) : (
				<div className="swatch-editor">
					<input
						onChange={event => {
							handleSwatchChange(event.target.value);
						}}
						value={swatchEditingElement ? swatchEditingElement.color : '#ffffff'}
						type="color"
					/>
					<button
						onClick={() => {
							setSwatchEditingElement(undefined);
							setSwatchEditorHidden(true);
						}}>
						Cancel
					</button>
					<button
						onClick={() => {
							submitSwatchChange();
							setSwatchEditorHidden(true);
						}}>
						Submit
					</button>
				</div>
			)}
		</div>
	);
};

export default CategoryList;
