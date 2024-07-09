import { useContext } from "react";
import { AuthContext } from "./AuthenticationContext";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {

    const { loading, user } = useContext(AuthContext);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" />;
};



PrivateRoute.propTypes = {
    children: PropTypes.node,
};
  
  export default PrivateRoute;