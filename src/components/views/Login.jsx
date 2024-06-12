import Navbar from "../organisms/Navbar";
import "../../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const performLogin = () => {
        let error = false;
        if(usernameValue.length === 0)
        {
            setUsernameError("Please enter a username"); 
            error = true;
        }
        else
        {
            setUsernameError("");            
        }

        if(passwordValue.length === 0)
        {
            setPasswordError("Please enter a password"); 
            error = true;
        }
        else
        {
            setPasswordError("");   
        }

        if(!error)
        {
            navigate("/");
        }
    }

    return(
        <>
            <Navbar routes={[{name: "Signup", path: "/signup"}]}/>
            <div className="parent">
                
                <div className="login-container">
                    <h1 className="login-title">Login</h1>
                    <div className="form-field">
                        <input onChange={(event) => {setUsernameValue(event.target.value)}} type="text" className="form-input" name="username" value={usernameValue} placeholder="Username"></input>
                        <span className="error">{usernameError}</span>
                    </div>
                    <div className="form-field">
                        <input onChange={(event) => {setPasswordValue(event.target.value)}} type="password" className="form-input" name="password" value={passwordValue} placeholder="Password"></input>
                        <span className="error">{passwordError}</span>
                    </div>
                    <div className="form-field">
                    <input className="login-button" type="button" onClick={performLogin} value={'Log in'} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;