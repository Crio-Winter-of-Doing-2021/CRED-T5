import React from 'react';

export default function Reward({ reward }) {
    const { cost, reward_id, body } = reward;
    const buyReward = async () => {
        const token = localStorage.token;
        try {
            const response = await fetch(`http://localhost:8080/rewards/buy/${reward_id}`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            const parseRes = await response.json();
            console.log(parseRes);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div style={{ border: "1px solid black" }}>
            <button onClick={buyReward}>Buy</button>
            <p>{body}</p>
            <p>{cost}</p>
        </div>
    )
}