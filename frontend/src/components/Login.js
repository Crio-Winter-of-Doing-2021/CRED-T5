import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container } from '@material-ui/core';
import { TextField } from '@material-ui/core';

export default function Login({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState('');
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
            if (parseRes.message === undefined) setAuth(true);
            else {
                setShowError(parseRes.message);
                setAuth(false);
            }
            localStorage.setItem("token", parseRes.access_token);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <Container>
            <Typography
                variant="h4"
                component="h1"
                color="primary"
                align="justify"
            >
                Welcome Back!
            </Typography>
            <form onSubmit={submitForm} autoComplete="off">
                {showError && <p style={{ color: "red" }}>{showError}</p>}
                <TextField id="outlined-basic" fullWidth size="small" label="Email" variant="outlined" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                <TextField id="outlined-basic" fullWidth size="small" label="Password" variant="outlined" type="password" onChange={(e) => { setPassword(e.target.value) }} required />
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    justify="center"
                >
                    Sign In
                </Button>
            </form>
            <Link to="./signup">Signup</Link>
        </Container>
    );
}