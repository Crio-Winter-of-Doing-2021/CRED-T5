import React from 'react';
import { useState } from 'react'
import { useHistory } from 'react-router';
export default function AddCard() {
    const history = useHistory();
    const [cardNo, setCardNo] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
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
                <input type="text" value={cardNo} onChange={(e) => setCardNo(e.target.value)} required />
                <label>Expiry Date: </label>
                <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                <label>Card Holder: </label>
                <input type="text" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />
                <button type="submit">Add Card</button>
            </form>
        </>
    )
}