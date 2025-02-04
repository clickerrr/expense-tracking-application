import BudgetCategoryTable from '@/components/molecules/budgeting/BudgetCategoryTable';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import '@/styles/editbudget.css';
import {useEffect, useState} from 'react';

interface EditBudgetCategoryTableProps {
	title: string;
	data: BudgetCategoryItem[];
	onCancel: () => void;
	onCompleteEditing: (title: string, newData: BudgetCategoryItem[]) => void;
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

	const addNewCategory = (newData: BudgetCategoryItem[]) => {
		console.log(newData);
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
					<BudgetCategoryTable
						propsCategories={editingData}
						setPropsCategories={addNewCategory}
					/>
				</div>
				<div className="footer-button-group">
					<button
						className="done-button"
						onClick={() => {
							onCompleteEditing(title, editingData);
						}}>
						Done
					</button>
				</div>
			</div>
		</div>
	);
};
export default EditBudgetCategoryTable;
