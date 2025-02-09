import {useEffect, useState} from 'react';
import '@/styles/budgettable.css';
import editLogo from '@/assets/edit-icon.svg';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';

interface BudgetTableProps {
	title: string;
	budgetData: BudgetCategoryItem[];
	onEdit: (categoryTitle: string) => void;
}

const BudgetCategoryTable = ({title, budgetData, onEdit}: BudgetTableProps) => {
	const headColumns: string[] = ['Category Title', 'Planned', 'Actual', 'Difference'];
	const [displayData, setDisplayData] = useState<BudgetCategoryItem[]>(budgetData);
	useEffect(() => {
		setDisplayData(budgetData);
		sumTotal('planned', setTotalPlanned);
		sumTotal('actual', setTotalActual);
		sumDifference();
	}, [title, budgetData, displayData]);

	const [totalPlanned, setTotalPlanned] = useState<number>(0);
	const [totalActual, setTotalActual] = useState<number>(0);
	const [totalDiff, setTotalDiff] = useState<number>(0);

	const sumTotal = (field: string, setter: (data: number) => void) => {
		let totalSum = 0;
		displayData.forEach((element: BudgetCategoryItem) => {
			const objectKeys = Object.keys(element);
			const found = objectKeys.findIndex(element => {
				return element === field;
			});
			console.log('found', found);
			if (found) {
				totalSum += Number(Object.values(element)[found]);
			}
		});
		setter(totalSum);
	};

	const sumDifference = () => {
		let totalDifference = 0;
		displayData.forEach((element: BudgetCategoryItem) => {
			totalDifference += element.planned - element.actual;
		});
		setTotalDiff(totalDifference);
	};

	const renderHeadColumns = () => {
		return headColumns.map((headColumn: string, index) => {
			return (
				<th key={index} className="table-head-element">
					<div>{handleColumnSwitch(headColumn)}</div>
				</th>
			);
		});
	};

	const handleColumnSwitch = (columnName: string) => {
		switch (columnName) {
			case 'Planned':
				return (
					<>
						<p>{columnName}</p>
						<p>${totalPlanned}</p>
					</>
				);
			case 'Actual':
				return (
					<>
						<p>{columnName}</p>
						<p>${totalActual}</p>
					</>
				);
			case 'Difference':
				return (
					<>
						<p>{columnName}</p>
						<p className={`${totalDiff >= 0 ? 'green-text' : 'red-text'}`}>
							${totalDiff}
						</p>
					</>
				);
			default:
				return <p>{columnName}</p>;
		}
	};

	const renderData = () => {
		return displayData.map((element: BudgetCategoryItem) => {
			const diff = element.planned - element.actual;
			return (
				<tr key={element.id} className="table-row">
					<td className="table-row-element">{element.title}</td>
					<td className="table-row-element">${element.planned}</td>
					<td className="table-row-element">${element.actual}</td>
					<td className={`table-row-element ${diff >= 0 ? 'green-text' : 'red-text'}`}>
						${element.planned - element.actual}
					</td>
				</tr>
			);
		});
	};

	return (
		<>
			<div className="table-title-container">
				<h2>{title}</h2>
				<button className="edit-button" onClick={() => onEdit(title)}>
					<img className="edit-icon" src={editLogo} />
				</button>
			</div>
			<div className="table-parent">
				<table className="table-container">
					<thead className="table-head">{renderHeadColumns()}</thead>
					<tbody className="table-body">{renderData()}</tbody>
				</table>
			</div>
		</>
	);
};
export default BudgetCategoryTable;
