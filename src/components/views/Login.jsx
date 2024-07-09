import Navbar from "../organisms/Navbar";
import "../../styles/login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from '../../AuthenticationContext';

const Login = () => {

    const { loginUser, loading, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const verifyFields = () => {
        let error = false;
        if(emailValue.length === 0)
        {
            setEmailError("Please enter an email"); 
            error = true;
        }
        else
        {
            setEmailError("");            
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

        
        return error;
        
        

    }

    

    const handleLogin = () => {
        if(verifyFields()) return;
        loginUser(emailValue, passwordValue)
        .then((result) => {
            console.log(result);
            navigate("/");
        })
        .catch((error) => {
            console.error(`${error}`);
            setGeneralError("Invalid email or password");
        });

    }

    

    return(
        <>
            <Navbar routes={[{name: "Signup", path: "/signup"}]}/>
            <div className="parent">
                
                <div className="login-container">
                    <h1 className="login-title">Login</h1>
                    <div className="form-field">
                        <input onChange={(event) => {setEmailValue(event.target.value)}} type="email" className="form-input" name="email" value={emailValue} placeholder="Email"></input>
                        <span className="error">{emailError}</span>
                    </div>
                    <div className="form-field">
                        <input onChange={(event) => {setPasswordValue(event.target.value)}} type="password" className="form-input" name="password" value={passwordValue} placeholder="Password"></input>
                        <span className="error">{passwordError}</span>
                    </div>
                    <div className="form-field">
                        <input className="login-button" type="button" onClick={handleLogin} value={'Log in'} />
                        <span className="error">{generalError}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;