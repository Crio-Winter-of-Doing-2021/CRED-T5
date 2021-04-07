import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import Card from './CreditCard';
export default function Cards({ logout }) {
    const history = useHistory();
    const [cards, setCards] = useState([]);
    async function getCards() {
        try {
            const token = localStorage.token;
            const response = await fetch('http://localhost:8080/cards', {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const parseRes = await response.json();
            setCards(parseRes);
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        getCards();
    }, []);
    const addCard = () => {
        history.push({
            pathname: "/cards/add"
        });
    }
    return (
        <>
            <button onClick={logout}>Logout</button>
            <button onClick={addCard}>Add Card</button>
            <h1>Cards</h1>
            <ul>
                {cards.map(card => {
                    return (
                        <Card key={card.card_id} card={card} />
                    );
                })}
            </ul>
        </>
    );
};