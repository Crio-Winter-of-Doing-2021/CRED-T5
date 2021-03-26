import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

export default function Statement(props) {
    const history = useHistory();
    const location = useLocation();
    const params = location.pathname.split('/');
    const card_id = params[2];
    // const card_id = props.location.state.card_id;
    const [statement, setStatement] = useState({});
    const [transactions, setTransactions] = useState([]);
    async function getStatement() {
        try {
            const token = await localStorage.token;
            const response = await fetch(`http://localhost:8080/cards/${card_id}/statements`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            const parseRes = await response.json();
            const { statement_id, month, year, net_amount } = parseRes;
            setStatement({ statement_id, month, year, net_amount });
            setTransactions(parseRes.transactions);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getStatement();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const buttonClicked = () => {
        history.push("/cards");
    }
    const viewSmart = () => {
        history.push({
            pathname: `/cards/${card_id}/statements/smart`,
        })
    }
    return (
        <div>
            {(statement && transactions) ? (
                <div>
                    <h3>Statement</h3>
                    <button onClick={buttonClicked}>Back</button>
                    <button onClick={viewSmart}>Smart View</button>
                    <p>Statement Id: {statement.statement_id}</p>
                    <p>For Card: {card_id}</p>
                    <p>Month: {statement.month}</p>
                    <p>Year: {statement.year}</p>
                    {transactions.map(transaction => {
                        return <div key={transaction.transaction_id} style={{ border: "1px solid black", margin: "2px" }}>
                            <p>Transaction Id: {transaction.transaction_id}</p>
                            <p>Amount: {transaction.amount}</p>
                            <p>Type: {transaction.type === "C" ? "Credit" : "Debit"}</p>
                            <p>Vendor: {transaction.vendor}</p>
                            <p>Category: {transaction.category}</p>
                        </div>
                    })}
                    <p>Total Payable amount: {statement.net_amount}</p>
                </div>) : (
                <div>
                    <p>No statements to display for the card</p>
                    <button onClick={buttonClicked}>Back</button>
                </div>
            )}
        </div>
    )
}