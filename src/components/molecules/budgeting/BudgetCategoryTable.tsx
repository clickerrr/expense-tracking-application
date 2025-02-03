import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import BudgetCategoryTableRow from '../../atoms/budgeting/BudgetCategoryTableRow';
import {useEffect, useState} from 'react';
import NewBudgetCategoryRow from '@/components/atoms/budgeting/NewBudgetCategoryRow';
interface BudgetCategoryTableProps {
	propsCategories: BudgetCategoryItem[];
	setPropsCategories: (data: BudgetCategoryItem[]) => void;
}
const BudgetCategoryTable = ({propsCategories, setPropsCategories}: BudgetCategoryTableProps) => {
	const [addingNewCategory, setAddingNewCategory] = useState<boolean>(false);
	const [categories, setCategories] = useState<BudgetCategoryItem[]>(propsCategories);
	useEffect(() => {
		setCategories(propsCategories);
	}, [propsCategories]);

	const submitNewCategory = (data: BudgetCategoryItem) => {
		setPropsCategories([...categories, data]);
		setAddingNewCategory(false);
	};

	const validAdditionToList = (data: BudgetCategoryItem) => {
		const found = categories.find((element: BudgetCategoryItem) => {
			return element.title.toLowerCase() === data.title.toLowerCase();
		});
		if (found !== null || found !== undefined) return false;
		return true;
	};

	return (
		<>
			<table className="new-budget-table">
				<tr>
					<th>Category</th>
					<th>Planned Amount</th>
					<th></th>
				</tr>
				{categories.map((category: BudgetCategoryItem) => {
					return <BudgetCategoryTableRow category={category} />;
				})}
				{addingNewCategory ? (
					<></>
				) : (
					<tr>
						<button
							onClick={() => {
								setAddingNewCategory(true);
							}}>
							+
						</button>
					</tr>
				)}
			</table>
			{addingNewCategory ? (
				<table className="new-budget-table-new-row">
					<NewBudgetCategoryRow
						onSubmit={(data: BudgetCategoryItem) => submitNewCategory(data)}
						onCancel={() => setAddingNewCategory(false)}
						errorCheck={validAdditionToList}
					/>
				</table>
			) : (
				<></>
			)}
		</>
	);
};
export default BudgetCategoryTable;
