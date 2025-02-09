import '@/styles/budgetbalanceview.css';
import {useEffect, useState} from 'react';

interface BalanceViewProps {
	startingBalance: number;
	projectedSpending: number;
	currentSpending: number;
}

const BalanceView = ({startingBalance, projectedSpending, currentSpending}: BalanceViewProps) => {
	useEffect(() => {
		console.log(startingBalance);
		console.log(projectedSpending);
		console.log(currentSpending);
		setProjectedBalance(startingBalance - projectedSpending);
		setActualBalance(startingBalance - currentSpending);
	}, [startingBalance, projectedSpending, currentSpending]);

	const [projectedBalance, setProjectedBalance] = useState<number>(0);
	const [actualBalance, setActualBalance] = useState<number>(0);

	return (
		// <div>
		<div className="balance-view-container">
			<p>Starting Monthly Balance: ${startingBalance}</p>
			<p>Projected Ending Balance: ${projectedBalance}</p>
			<p>
				Current Ending Balance: $
				<span className={`${actualBalance >= 0 ? 'green-text' : 'red-text'}`}>
					{actualBalance}
				</span>
			</p>
		</div>
		// </div>
	);
};
export default BalanceView;
