import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

export default function Signup({ setAuth }) {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [goToLogin, setGoToLogin] = useState(false);
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { first_name, last_name, email, password };
            const response = await fetch('http://localhost:8080/signup', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            await response.json();
            setGoToLogin(true);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <>
            <h1>Signup Page</h1>
            <form onSubmit={submitForm}>
                <label>First Name: </label>
                <input type="text" value={first_name} onChange={(e) => { setFirstName(e.target.value) }} required />
                <label>Last Name: </label>
                <input type="text" value={last_name} onChange={(e) => { setLastName(e.target.value) }} />
                <label>Email: </label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                <label>Password: </label>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} required />
                <button type="submit">Signup</button>
            </form>
            <Link to="./login">Login</Link>
            {goToLogin && <Redirect to="./login" />}
        </>
    );
}