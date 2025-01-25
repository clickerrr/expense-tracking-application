import { useEffect, useState } from 'react';
import '../../styles/expensescategory.css';
import BudgetCategoryItem from '../../types/BudgetCategoryItem';
import BudgetCategoryElement from '../atoms/BudgetCategoryElement';
interface ExpensesCategoryProps {
	propsSelectedYear: number;
	propsSelectedMonth: number;
}

const ExpensesCategory = ({ propsSelectedMonth, propsSelectedYear }: ExpensesCategoryProps) => {
	const [categoryData, setCategoryData] = useState<BudgetCategoryItem[]>([]);

	const [actualAmount, setActualAmount] = useState<number>(0);
	const [calculatedDifference, setCalculatedDifference] = useState<number>(0);

	useEffect(() => {
		console.log('propsSelectedMonth', propsSelectedMonth);
		console.log('propsSelectedYear', propsSelectedYear);

		fetch(`http://127.0.0.1:3000/budgeting/category/all`)
			.then((response) => {
				return response.json();
			})
			.then((result) => {
				console.log('result', result);
				const finalResult: BudgetCategoryItem[] = [];
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result.result.forEach((element: any) => {
					const newElement: BudgetCategoryItem = {
						id: element.cat_id,
						title: element.cat_title,
						planned: 0,
						actual: 0,
					};
					finalResult.push(newElement);
				});

				return finalResult;
			})
			.then((finalResult: BudgetCategoryItem[]) => {
				fetch(
					`http://127.0.0.1:3000/budgeting/expenses/category/${propsSelectedYear}/${propsSelectedMonth}`
				)
					.then((response) => {
						return response.json();
					})
					.then((result) => {
						console.log('result', result);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						result.results.forEach((element: any) => {
							const foundCategory = finalResult.find(
								(categoryItem: BudgetCategoryItem) => {
									return element.cat_id === categoryItem.id;
								}
							);
							console.log('foundCategory', foundCategory);
							if (foundCategory === undefined) return;
							foundCategory.actual = element.cat_sum;
						});
						setCategoryData(finalResult);
						setActualAmount(calculateActualAmount(finalResult));
						setCalculatedDifference(calculateDifferences(finalResult));
					});
			});
	}, [propsSelectedYear, propsSelectedMonth]);

	const renderList = () => {
		if (categoryData === undefined) {
			console.log('categoryData is undefined');
			return;
		}
		return categoryData.map((element: BudgetCategoryItem, index: number) => {
			return <BudgetCategoryElement key={index} data={element}></BudgetCategoryElement>;
		});
	};

	const calculateActualAmount = (data: BudgetCategoryItem[]) => {
		let actualSum = 0;
		data.forEach((element: BudgetCategoryItem) => {
			actualSum += element.actual;
		});
		return actualSum;
	};

	const calculateDifferences = (data: BudgetCategoryItem[]) => {
		let calculatedDifferences = 0;
		data.forEach((element) => {
			calculatedDifferences += element.planned - element.actual;
		});
		return calculatedDifferences;
	};

	return (
		<div className="expenses-category-pane">
			<span className="pane-title">Expenses</span>

			<div className="expenses-category-header">
				<span className="savings-subtext">Totals</span>
				<div className="header-subcat">
					<span className="savings-subtext">Planned:</span>
					<span className="savings-subtext">$0</span>
				</div>
				<div className="header-subcat">
					<span className="savings-subtext">Actual:</span>

					<span className="savings-subtext">${actualAmount}</span>
				</div>
				<div className="header-subcat">
					<span className="savings-subtext">Diff:</span>
					<span className="savings-subtext">${calculatedDifference}</span>
				</div>
			</div>

			{renderList()}
		</div>
	);
};

export default ExpensesCategory;
