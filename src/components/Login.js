import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Import the CSS for styling

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_API_URL;

    const handleRegister = async (e) => {
        e.preventDefault(); //prevent page reload
        setErrorMessage('');
        setSuccessMessage('');

        try {
            //register API call with username and password
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });
            
            //handle response
            if (response.status === 201) {
                setSuccessMessage('Registration successful. Please login with your new credentials.');
                setErrorMessage(''); // Clear error message
            }else if (response.status === 409)
                setErrorMessage('Username already exists. Please try a different one.');
            else
                setErrorMessage('Registration failed. Please try again.');
            

        } catch (error) {
            console.error('Registration failed', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    }

    //login API call with username and password, if successful returns the JWT used for authentication on all subsequent features and redirects to the dashboard    
    const handleLogin = async (e) => {
        e.preventDefault(); //prevent page reload
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem('token', data.jwt);  //store the JWT token
                navigate('/dashboard');
            } else if (response.status === 401)
                setErrorMessage('Invalid credentials. Please try again.');
            else if (response.status === 404)
                setErrorMessage('Username not found. Please register.');
            else
                setErrorMessage('Login failed. Please try again.');
            
        } catch (error) {
            console.error('Login failed', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form">
                <div className="input-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button onClick={handleRegister}>Register</button> 
                <button onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
