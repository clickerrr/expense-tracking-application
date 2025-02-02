import '@/styles/expensescategory.css';

const IncomeCategory = () => {
	return (
		<div className="expenses-category-pane">
			<span className="pane-title">Income</span>

			<div className="expenses-category-header">
				<span className="savings-subtext">Totals</span>
				<div className="header-subcat">
					<span className="savings-subtext">Planned:</span>
					<span className="savings-subtext">$250</span>
				</div>
				<div className="header-subcat">
					<span className="savings-subtext">Actual:</span>

					<span className="savings-subtext">$350</span>
				</div>
				<div className="header-subcat">
					<span className="savings-subtext">Diff:</span>
					<span className="savings-subtext">$100</span>
				</div>
			</div>
			<div className="expenses-category-line">
				<div className="expenses-category-name">
					<span>Name</span>
				</div>

				<div className="expenses-category-planned">
					<span>$200</span>
				</div>

				<div className="expenses-category-actual">
					<span>$300</span>
				</div>
				<div className="expenses-category-diff">
					<span>+100</span>
				</div>
			</div>
			<div className="expenses-category-line">
				<div className="expenses-category-name">
					<span>Name</span>
				</div>

				<div className="expenses-category-planned">
					<span>$200</span>
				</div>

				<div className="expenses-category-actual">
					<span>$300</span>
				</div>
				<div className="expenses-category-diff">
					<span>+100</span>
				</div>
			</div>
			<div className="expenses-category-line">
				<div className="expenses-category-name">
					<span>Name</span>
				</div>

				<div className="expenses-category-planned">
					<span>$200</span>
				</div>

				<div className="expenses-category-actual">
					<span>$300</span>
				</div>
				<div className="expenses-category-diff">
					<span>+100</span>
				</div>
			</div>
		</div>
	);
};

export default IncomeCategory;
