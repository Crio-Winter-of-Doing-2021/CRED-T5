import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login({setAuth}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password };
            const response = await fetch('http://localhost:8080/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            if(parseRes.message === undefined)setAuth(true);
            else setAuth(false);
            localStorage.setItem("token", parseRes.access_token);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <>
            <h1>Login Page</h1>
            <form onSubmit={submitForm}>
                <label>Email: </label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                <label>Password: </label>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} required />
                <button type="submit">Login</button>
            </form>
            <Link to="./signup">Signup</Link>
        </>
    );
}