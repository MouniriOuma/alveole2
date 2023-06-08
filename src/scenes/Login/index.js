import React, { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { login } from "../../actions/auth";
import { useNavigate } from 'react-router-dom';

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const form = useRef(null);
    const navigate = useNavigate();

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };




    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        login(username, password)
            .then((response) => {
                setLoading(false);
                if (response.type === 'LOGIN_SUCCESS') {
                    setLoggedIn(true);


                    //const { token, id, username, email, roles } = response.data;
                    console.log('Logged in as:', username);
                    localStorage.setItem('username', username);



                    // Redirect to Dashboard
                    navigate('/Dashboard');

                } else if (response.type === 'LOGIN_FAIL') {
                    setLoggedIn(false);
                    setErrorMessage(response.payload.message); // Set the error message from the payload
                }
            })
            .catch((error) => {
                setLoading(false);
                setLoggedIn(false);
                setErrorMessage(error?.response?.data?.message || 'Login failed'); // Set error message received from backend or a default message
            });
    };



    return (
        <div className="col-md-12">
            <div className="card card-container">
                <form onSubmit={handleLogin} ref={form}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={username}
                            onChange={onChangeUsername}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Login</span>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        </div>
                    )}
                    <button style={{ display: 'none' }} type="submit">Hidden Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
