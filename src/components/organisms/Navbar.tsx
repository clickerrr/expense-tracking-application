import { NavLink } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
	return (
		<div className="navbar">
			<h1 className="navbar-title">Expense Tracker</h1>
			<NavLink className={`nav-item`} to="/">
				Home
			</NavLink>
			<NavLink className={`nav-item`} to="/metrics">
				Metrics
			</NavLink>
		</div>
	);
};

export default Navbar;
