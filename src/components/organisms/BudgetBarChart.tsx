import { useEffect, useState } from 'react';

import '../../styles/budgetbarchart.css';

interface BudgetBarChartProps {
	propsTitle: string;
	propsPlannedTotal: number;
	propsActualTotal: number;
}

const BudgetBarChart = ({
	propsTitle,
	propsPlannedTotal,
	propsActualTotal,
}: BudgetBarChartProps) => {
	const [title, setTitle] = useState('');
	const [plannedTotal, setPlannedTotal] = useState(0);
	const [actualTotal, setAcutalTotal] = useState(0);

	const [plannedTotalPercentage, setPlannedTotalPercentage] = useState(100);
	const [actualTotalPercentage, setActualTotalPercentage] = useState(100);

	useEffect(() => {
		setTitle(propsTitle);
		setPlannedTotal(propsPlannedTotal);
		setAcutalTotal(propsActualTotal);
		evaluatePercentages(propsPlannedTotal, propsActualTotal);
	}, [propsTitle, propsPlannedTotal, propsActualTotal]);

	const evaluatePercentages = (plannedTotal: number, actualTotal: number) => {
		if (plannedTotal > actualTotal) {
			const percent = (actualTotal / plannedTotal) * 100;
			setActualTotalPercentage(percent);
			setPlannedTotalPercentage(100);
		} else {
			const percent = (plannedTotal / actualTotal) * 100;
			setPlannedTotalPercentage(percent);
			setActualTotalPercentage(100);
		}
	};

	return (
		<div className="barchart-pane">
			<span className="pane-title">{title}</span>
			<div className="bar-chart-item">
				<span className="bar-title">Planned</span>
				<span>${plannedTotal}</span>
				<div className="bar-container">
					<div className="bar" style={{ width: `${plannedTotalPercentage}%` }}></div>
				</div>
			</div>
			<div className="bar-chart-item">
				<span>Actual</span>
				<span>${actualTotal}</span>
				<div className="bar-container">
					<div className="bar" style={{ width: `${actualTotalPercentage}%` }}></div>
				</div>
			</div>
		</div>
	);
};

export default BudgetBarChart;
