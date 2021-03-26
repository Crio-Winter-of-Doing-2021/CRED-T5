import React from 'react';
import { useState } from 'react'
import { Redirect, useHistory } from 'react-router';
export default function AddCard() {
    const history = useHistory();
    const [cardNo, setCardNo] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardAdded, setCardAdded] = useState(false);
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { card_no: cardNo, expiry_date: expiryDate, name_on_card: cardHolder };
            const token = localStorage.token;
            const response = await fetch('http://localhost:8080/cards', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
            if (parseRes.message === undefined)
                setCardAdded(true);
        } catch (err) {
            console.log(err.message);
        }
    }
    const goBack = () => {
        history.goBack();
    }
    return (
        <>
            <button onClick={goBack}>Back</button>
            <form onSubmit={submitForm}>
                <label>Card No.: </label>
                <input type="text" placeholder="16 digit card no." value={cardNo} onChange={(e) => setCardNo(e.target.value)} required />
                <label>Expiry Date: </label>
                <input type="text" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                <label>Card Holder: </label>
                <input type="text" placeholder="Name on card" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />
                <button type="submit">Add Card</button>
                {cardAdded && <Redirect to={{ pathname: "/cards" }} />}
            </form>
        </>
    )
}