import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reward from './Reward';

export default function Rewards() {
    const [rewards, setRewards] = useState([]);
    const [coin_bal, setCoinBal] = useState(0);
    const getRewards = async () => {
        const token = localStorage.token;
        try {
            const response = await fetch('http://localhost:8080/rewards', {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const parseRes = await response.json();
            if (parseRes.message === undefined) {
                setRewards(parseRes.rewards);
                setCoinBal(parseRes.coin_bal);
            }
            else setRewards([]);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getRewards();
    }, [coin_bal,rewards]);
    return (
        <>
            <h1>This is the Rewards page</h1>
            <Link to={{
                pathname: "/cards",
            }}>Back</Link>
            <p>Available Coin Balance: {coin_bal}</p>
            {rewards.map(reward => {
                return <Reward key={reward.reward_id} reward={reward} />
            })}
        </>
    )
}