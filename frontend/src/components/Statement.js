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
    const [search, setSearch] = useState('');
    const [hideSmartView, setHideSmartView] = useState(false);
    async function getStatement() {
        try {
            const token = await localStorage.token;
            if (search === '') {
                setHideSmartView(false);
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
            }
            else {
                setHideSmartView(true);
                const response = await fetch(`http://localhost:8080/cards/${card_id}/statements/${search}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
                const parseRes = await response.json();
                const { statement_id, net_amount } = parseRes;
                console.log(search);
                const byDate = search.split("/");
                console.log(byDate);
                const month = parseInt(byDate[1]);
                const year = parseInt(byDate[0]);
                setStatement({ statement_id, month, year, net_amount });
                console.log(parseRes.transactions);
                setTransactions(parseRes.transactions);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getStatement();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])
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
            {search !== '' || (statement && transactions) ? (
                <div>
                    <h3>Statement</h3>
                    <button onClick={buttonClicked}>Back</button>
                    {!hideSmartView && <button onClick={viewSmart}>Smart View</button>}
                    <input placeholder="YYYY/MM" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {(search === '') && <p><b>Showing the most recent statement</b></p>}
                    {(statement && transactions) ? (
                        <div>
                            <p>Statement Id: {statement.statement_id}</p>
                            <p>For Card: {card_id}</p>
                            <p>Month: {statement.month}</p>
                            <p>Year: {statement.year}</p>
                            {transactions.map(transaction => {
                                return <div key={transaction.transaction_id} style={{ border: "1px solid black", margin: "2px" }}>
                                    <p>Transaction Id: {transaction.transaction_id}</p>
                                    <p>Amount: {transaction.amount}</p>
                                    <p>Type: {transaction.type === "C" ? "Credit" : "Debit"}</p>
                                    <p>Merchant: {transaction.merchant}</p>
                                    <p>Category: {transaction.category}</p>
                                </div>
                            })}
                            <p>Total Payable amount: {statement.net_amount}</p>
                        </div>
                    ) : (
                        <p>No statements present for entered month</p>
                    )
                    }
                </div>) : (
                <div>
                    <p>No statements to display for the card</p>
                    <button onClick={buttonClicked}>Back</button>
                </div>
            )}
        </div>
    )
}