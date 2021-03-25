import React from 'react';
export default function Category({ category }) {
    // console.log(category);
    const name = category.category;
    const { amount_spent, count } = category;
    return (
        <div style={{ border: "1px solid black" }}>
            <p>{name}</p>
            <p>&#8377;{amount_spent}</p>
            <p>{count} {count>1?"transactions":"transaction"}</p>
        </div>
    )
}