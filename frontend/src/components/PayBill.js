import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';

export default function PayBill() {
    const history = useHistory();
    const location = useLocation();
    const params = location.pathname.split('/');
    const card_id = params[2];
    const [payAmount, setPayAmount] = useState(0);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const goBack = () => {
        history.goBack();
    }
    const pay = async () => {
        try {
            const body = { amount: payAmount };
            const token = await localStorage.token;
            const response = await fetch(`http://localhost:8080/cards/${card_id}/pay`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
            if (parseRes.message === undefined)
                setPaymentSuccessful(true);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <div>
            <h1>Payments Page</h1>
            <label>Enter amount to pay: </label>
            <input type="text" onChange={(e) => setPayAmount(e.target.value)} required />
            <button onClick={pay}>Pay Amount</button>
            <button onClick={goBack}>Cancel</button>
            {paymentSuccessful && <Redirect to={{ pathname: "/cards" }} />}
        </div>
    )
}