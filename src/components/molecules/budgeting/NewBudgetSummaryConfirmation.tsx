import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import editLogo from '@/assets/edit-icon.svg';
import StartingBalanceInput from '@/components/atoms/budgeting/StartingBalanceInput';
import {useState} from 'react';

interface NewBudgetSummaryConfirmationProps {
	data: BudgetCategoryItem[][];
	changePage: (pageNumber: number) => void;
}

const NewBudgetSummaryConfirmation = ({data, changePage}: NewBudgetSummaryConfirmationProps) => {
	const [startingAmount, setStartingAmount] = useState<number>(0);

	const returnProperTitle = (index: number) => {
		switch (index) {
			case 0:
				return (
					<>
						<h3>Expenses</h3>
						<button
							onClick={() => {
								changePage(1);
							}}
							className="new-budget-summary-edit-button">
							<img className="new-budget-summary-edit-icon" src={editLogo} />
						</button>
					</>
				);
			case 1:
				return (
					<>
						<h3>Monthly Expenses</h3>
						<button
							onClick={() => {
								changePage(2);
							}}
							className="new-budget-summary-edit-button">
							<img className="new-budget-summary-edit-icon" src={editLogo} />
						</button>
					</>
				);
			case 2:
				return (
					<>
						<h3>Monthly Income</h3>
						<button
							onClick={() => {
								changePage(3);
							}}
							className="new-budget-summary-edit-button">
							<img className="new-budget-summary-edit-icon" src={editLogo} />
						</button>
					</>
				);
			default:
				return <></>;
		}
	};

	const renderTables = () => {
		return data.map((item: BudgetCategoryItem[], index: number) => {
			if (item.length > 0) {
				return (
					<>
						<div className="new-budget-summary-edit">{returnProperTitle(index)}</div>

						<div className="new-budget-starting-input">
							<StartingBalanceInput
								title={'Enter starting amount'}
								value={startingAmount}
								setValue={setStartingAmount}
							/>
						</div>

						<table className="new-budget-table">
							<tr>
								<th>Category</th>
								<th>Planned Amount</th>
							</tr>
							{item.map((category: BudgetCategoryItem) => {
								return (
									<tr>
										<td>{category.title}</td>
										<td>${category.planned}</td>
									</tr>
								);
							})}
						</table>
					</>
				);
			}
		});
	};

	return (
		<div className="new-budget-category-form">
			<h1>Summary</h1>
			<p>Make sure everything here looks good to you!</p>
			{renderTables()}
		</div>
	);
};
export default NewBudgetSummaryConfirmation;
