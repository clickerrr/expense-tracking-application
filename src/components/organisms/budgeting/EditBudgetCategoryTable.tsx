import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import '@/styles/editbudget.css';
import {useEffect, useState} from 'react';
import NewBudgetCategoryTable from '@/components/molecules/budgeting/NewBudgetCategoryTable';

interface EditBudgetCategoryTableProps {
	title: string;
	data: BudgetCategoryItem[];
	onCancel: () => void;
	onCompleteEditing: (
		title: string,
		newData: BudgetCategoryItem[],
		deletedData: BudgetCategoryItem[],
	) => void;
}

const EditBudgetCategoryTable = ({
	title,
	data,
	onCancel,
	onCompleteEditing,
}: EditBudgetCategoryTableProps) => {
	useEffect(() => {
		setEditingData(
			data.map((element: BudgetCategoryItem) => {
				return {...element};
			}),
		);
	}, [title, data, onCompleteEditing]);

	const [editingData, setEditingData] = useState<BudgetCategoryItem[]>(data);
	const [deletedData, setDeletedData] = useState<BudgetCategoryItem[]>([]);

	const removeCategory = (removedData: BudgetCategoryItem) => {
		const filteredList = editingData.filter((element: BudgetCategoryItem) => {
			return element.id !== removedData.id;
		});
		setDeletedData([...deletedData, removedData]);
		setEditingData(filteredList);
	};

	const addNewCategory = (newData: BudgetCategoryItem[]) => {
		console.log('newData', newData);
		setEditingData(newData);
	};

	return (
		<div className="edit-budget-parent">
			<div className="edit-budget-container">
				<div className="edit-budget-header">
					<h2>{title}</h2>
					<button className="cancel-button" onClick={onCancel}>
						×
					</button>
				</div>
				<div className="table-container">
					<NewBudgetCategoryTable
						propsCategories={editingData}
						setPropsCategories={addNewCategory}
						onRemoveElement={removeCategory}
					/>
				</div>
				<div className="footer-button-group">
					<button
						className="done-button"
						onClick={() => {
							console.log('DELETED CATEGORIES', deletedData);
							onCompleteEditing(title, editingData, deletedData);
						}}>
						Done
					</button>
				</div>
			</div>
		</div>
	);
};
export default EditBudgetCategoryTable;
