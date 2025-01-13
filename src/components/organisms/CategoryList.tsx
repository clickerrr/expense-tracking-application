import { useContext, useEffect, useState } from 'react';
import CategoryListContext, { CategoryListContextProps } from '../context/CategoryListContext';
import Category from '../../types/Category';
import '../../styles/categoryList.css';
import NewCategoryLine from '../atoms/NewCategoryLine';

const CategoryList = () => {
	const categoryContext = useContext<CategoryListContextProps | undefined>(CategoryListContext);

	const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [newCategoryLineShowing, setNewCategoryLineShowing] = useState<boolean>(false);

	useEffect(() => {
		if (categoryContext === undefined) {
			setCategoryList([]);
		} else {
			setCategoryList(categoryContext.categoryList);
		}
	}, [categoryContext]);

	const handleShowCategoryAdder = () => {
		if (categoryContext === undefined) return;

		setNewCategoryLineShowing(true);
	};

	const handleHideCategoryAdder = () => {
		if (categoryContext === undefined) return;

		setNewCategoryLineShowing(false);
	};

	const handleAddingNewCategory = (newCategoryName: string) => {
		if (categoryContext === undefined) return;
		const newCategory: Category = { id: -1, title: newCategoryName };
		handleAddNewCategoryRemote(newCategory);
		categoryContext.updateCategoryList([...categoryList, newCategory]);

		handleHideCategoryAdder();
	};

	const handleAddNewCategoryRemote = (newCategory: Category) => {
		const requestHeaders = new Headers();
		requestHeaders.append('Content-Type', 'application/json');

		fetch('http://127.0.0.1:3000/category/add', {
			body: JSON.stringify({
				title: newCategory.title,
			}),
			method: 'POST',
			headers: requestHeaders,
		})
			.then((response) => {
				return response.json();
			})
			.then((result) => {
				console.log(result);
				newCategory.id = result['cat_id'];
				console.log('newcategory', newCategory);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const renderList = () => {
		return categoryList.map((category: Category) => {
			return (
				<div className="category-item">
					<span className="title">{category.title}</span>
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
					className="button"
				>
					+ Add New Category
				</button>
			</div>
			<div className="category-list">
				{renderList()}
				{newCategoryLineShowing ? (
					<NewCategoryLine
						onSave={handleAddingNewCategory}
						onCancel={handleHideCategoryAdder}
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default CategoryList;
