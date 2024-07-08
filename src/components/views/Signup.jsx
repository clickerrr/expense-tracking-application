import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import Navbar from "../organisms/Navbar";
import "../../styles/signup.css";
import { AuthContext } from '../../AuthenticationContext';

const Signup = () => {
    
    const navigate = useNavigate();
    const { createUser } = useContext(AuthContext);
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

    
    const handleSignUp = () => {

        if(verifyFields() === true) return;
        createUser(emailValue, passwordValue)
        .then((result) => {
            console.log(result);
            navigate("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`${errorCode}: ${errorMessage}`);
            setGeneralError("Invalid email or password");
        });

    }
    

    
    return(
        <>
            <Navbar routes={[{name: "Login", path: "/login"}]}/>
            <div className="parent">
                
                <div className="signup-container">
                    <h1 className="signup-title">Sign Up</h1>
                    <div className="form-field">
                        <input onChange={(event) => {setEmailValue(event.target.value)}} type="email" className="form-input" name="email" value={emailValue} placeholder="Email"></input>
                        <span className="error">{emailError}</span>
                    </div>
                    <div className="form-field">
                        <input onChange={(event) => {setPasswordValue(event.target.value)}} type="password" className="form-input" name="password" value={passwordValue} placeholder="Password"></input>
                        <span className="error">{passwordError}</span>
                    </div>
                    <div className="form-field">
                        <input className="signup-button" type="button" onClick={handleSignUp} value={'Sign up'} />
                        <span className="error">{generalError}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup;