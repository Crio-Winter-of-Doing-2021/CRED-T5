import React from 'react'
// import Cards from './Cards'

export default function Card({card}){
    return(
        <div style={{border:"1px solid black"}}>
            <p>Card No.: {card.card_no}</p>
            <p>Card holder: {card.name_on_card}</p>
            <p>Expiry Date: {card.expiry_date}</p>
            <p>Outstanding: &#8377; {card.outstanding_amount}</p>
            <button>Pay Bill</button>
            <button>View Statement</button>
        </div>
    )
}