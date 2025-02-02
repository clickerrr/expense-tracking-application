import ExpenseList from '@/components/organisms/expenses/ExpenseList';
import CategoryList from '@/components/organisms/category/CategoryList';
import '@/styles/dashboard.css';

const Dashboard = () => {
	return (
		<div>
			<h1 className="dashboard-title">Dashboard</h1>
			<div className="central-dashboard">
				<ExpenseList />
				<div className="right-dashboard">
					<CategoryList />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
