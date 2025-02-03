import '@/styles/budgetbalanceview.css';
import {useEffect} from 'react';

interface BalanceViewProps {
	startingBalance: number;
	projectedSpending: number;
	currentSpending: number;
}

const BalanceView = ({startingBalance, projectedSpending, currentSpending}: BalanceViewProps) => {
	useEffect(() => {}, [startingBalance, projectedSpending, currentSpending]);

	const projectedBalance = startingBalance - projectedSpending;
	const actualBalance = startingBalance - currentSpending;

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
