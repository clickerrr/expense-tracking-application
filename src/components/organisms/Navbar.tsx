import {NavLink} from 'react-router-dom';
import '@/styles/navbar.css';

const Navbar = () => {
	return (
		<div className="navbar">
			<NavLink to="/" className={'navbar-title'}>
				Expense Tracker
			</NavLink>
			<NavLink className={`nav-item`} to="/">
				Home
			</NavLink>
			{/* <NavLink className={`nav-item`} to="/metrics">
				Metrics
			</NavLink> */}
			<NavLink className={`nav-item`} to="/budgeting">
				Budgeting
			</NavLink>
		</div>
	);
};

export default Navbar;
