import Category from '@/types/Category';
import '@/styles/categoryForm.css';
import {useEffect, useState} from 'react';
interface CategoryFormProps {
	onClose: () => void;
	onSave: (category: Category) => void;
	categoryToEdit: Category | undefined;
	passedError: string | null;
}

const CategoryForm = ({onClose, onSave, categoryToEdit, passedError}: CategoryFormProps) => {
	const [category, setCategory] = useState<Category | undefined>(undefined);
	const [catName, setCatName] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (passedError) {
			setError(passedError);
		}
		if (categoryToEdit !== undefined) {
			setCategory(categoryToEdit);
			setCatName(categoryToEdit.title);
		}
	}, [categoryToEdit, passedError]);

	const handleSave = () => {
		if (catName.length === 0) {
			setError('Category name may not be empty.');
			return;
		}
		const updatedCategory = {
			id: -1,
			title: catName,
			removable: true,
			editable: true,
			color: '#ffffff',
		};
		if (categoryToEdit) {
			updatedCategory.id = categoryToEdit.id;
		}

		onSave(updatedCategory);
	};

	return (
		<div className="category-form-modal">
			<div className="category-form-container">
				<div className="category-form-header">
					<div>{category !== undefined ? 'Edit Category' : 'Create New Category'}</div>
					<button className="close-button" onClick={() => onClose()}>
						Close
					</button>
				</div>

				<div className="category-form-content">
					<label htmlFor="category-name">Category Name</label>
					<input
						id="category-name"
						placeholder="Category Name"
						value={catName}
						onChange={event => setCatName(event.target.value)}></input>
					<span className="error">{error}</span>
					<button onClick={() => handleSave()} className="save-button">
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default CategoryForm;
