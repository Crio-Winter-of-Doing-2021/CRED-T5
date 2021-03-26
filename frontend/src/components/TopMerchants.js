import React from 'react';
import Merchant from './Merchant';
export default function TopMerchants({ merchants }) {
    return (
        <div style={{ border: "1px solid black" }}>
            <h2>Top merchants</h2>
            <ul>
                {merchants.map((merchant) => {
                    return <Merchant key={merchant.merchant} merchant={merchant} />
                })}
            </ul>
        </div>
    )
}