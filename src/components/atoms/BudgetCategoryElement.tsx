import { useEffect } from 'react';
import BudgetCategoryItem from '../../types/BudgetCategoryItem';
interface BudgetCategoryElementProps {
	data: BudgetCategoryItem;
}
const BudgetCategoryElement = ({ data }: BudgetCategoryElementProps) => {
	useEffect(() => {}, [data]);
	return (
		<div className="expenses-category-line">
			<div className="expenses-category-name">
				<span>{data.title}</span>
			</div>

			<div className="expenses-category-planned">
				<span>${data.planned}</span>
			</div>

			<div className="expenses-category-actual">
				<span>${data.actual}</span>
			</div>
			<div className="expenses-category-diff">
				<span>${data.planned - data.actual}</span>
			</div>
		</div>
	);
};

export default BudgetCategoryElement;
