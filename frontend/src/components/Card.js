import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Card({ card }) {
    const history = useHistory();
    const buttonClicked = () => {
        history.push({
            pathname: `/cards/${card.card_id}/statements`
        });
    }
    const payBill = () => {
        history.push({
            pathname: `/cards/${card.card_id}/payment`
        });
    }
    return (
        <div style={{ border: "1px solid black" }}>
            <p>Card No.: {card.card_no}</p>
            <p>Card holder: {card.name_on_card}</p>
            <p>Expiry Date: {card.expiry_date}</p>
            <p>Outstanding: &#8377; {card.outstanding_amount}</p>
            <button onClick={payBill}>Pay Bill</button>
            <button onClick={buttonClicked}>View Statements</button>
        </div >
    )
}