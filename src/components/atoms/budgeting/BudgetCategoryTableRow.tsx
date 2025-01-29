import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import {useEffect, useState} from 'react';

interface BudgetCategoryTableProps {
	category: BudgetCategoryItem;
}
const BudgetCategoryTableRow = ({category}: BudgetCategoryTableProps) => {
	const [plannedAmount, setPlannedAmount] = useState<number>(category.planned);
	useEffect(() => {}, [category]);
	return (
		<tr className="smaller">
			<td>{category.title}</td>
			<td>
				$
				<input
					type={'number'}
					onChange={event => {
						setPlannedAmount(Number(event.target.value));
					}}
					value={plannedAmount}
				/>
			</td>
		</tr>
	);
};

export default BudgetCategoryTableRow;
