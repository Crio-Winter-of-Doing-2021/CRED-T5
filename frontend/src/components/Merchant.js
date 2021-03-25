import React from 'react';
export default function Merchant({ merchant }) {
    // console.log(merchant);
    const name = merchant.merchant;
    const { amount_spent, percentage } = merchant;
    return (
        <div style={{ border: "1px solid black" }}>
            <p>{name}</p>
            <p>&#8377;{amount_spent}</p>
            <p>{percentage}%</p>
        </div>
    )
}