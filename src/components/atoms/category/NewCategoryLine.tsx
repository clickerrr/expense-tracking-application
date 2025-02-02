import { useState } from 'react';

interface NewCategoryLineProps {
	onSave: (catName: string) => void;
	onCancel: () => void;
}

const NewCategoryLine = ({ onSave, onCancel }: NewCategoryLineProps) => {
	const [catName, setCatName] = useState<string>('');

	return (
		<div className="category-item">
			<input
				placeholder="Enter new category name"
				className="title"
				onChange={(event) => {
					setCatName(event.target.value);
				}}
				value={catName}
			/>
			<div className="button-group">
				<button onClick={() => onCancel()}>Cancel</button>
				<button onClick={() => onSave(catName)}>Save</button>
			</div>
		</div>
	);
};
export default NewCategoryLine;
