import React, { useEffect } from 'react';
import { useState } from 'react';
import Card from './Card';
export default function Cards({ logout }) {
    const [cards, setCards] = useState([]);
    async function getCards() {
        try {
            const token = localStorage.token;
            const response = await fetch('http://localhost:8080/cards', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
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
    return (
        <>
            <button onClick={logout}>Logout</button>
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