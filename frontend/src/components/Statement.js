import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import SmartStatement from './SmartStatement';

export default function Statement(props) {
    const history = useHistory();
    const location = useLocation();
    const params = location.pathname.split('/');
    const card_id = params[2];
    // const card_id = props.location.state.card_id;
    const [statement, setStatement] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchMonth, setSearchMonth] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [toggleSmartView, setToggleSmartView] = useState(true);
    async function getStatement() {
        try {
            const token = await localStorage.token;
            if ((searchYear + searchMonth) === '') {
                const response = await fetch(`http://localhost:8080/cards/${card_id}/statements`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
                const parseRes = await response.json();
                setErrorMessage(parseRes.message);
                const { statement_id, month, year, net_amount } = parseRes;
                setStatement({ statement_id, month, year, net_amount });
                setTransactions(parseRes.transactions);
            }
            else {
                const response = await fetch(`http://localhost:8080/cards/${card_id}/statements/${searchYear}/${searchMonth}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
                const parseRes = await response.json();
                // console.log(parseRes.message);
                setErrorMessage(parseRes.message);
                const { statement_id, net_amount } = parseRes;
                const month = searchMonth;
                const year = searchYear;
                setStatement({ statement_id, month, year, net_amount });
                // console.log(parseRes.transactions);
                setTransactions(parseRes.transactions);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getStatement();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchYear, searchMonth])
    const buttonClicked = () => {
        history.push("/cards");
    }
    const viewSmart = () => {
        // history.push({
        //     pathname: `/cards/${card_id}/statements/smart`,
        // })
        setToggleSmartView(!toggleSmartView);
        // console.log(toggleSmartView);
    }
    return (
        <div>
            {(searchYear + searchMonth) !== '' || (statement && transactions) ? (
                <div>
                    <h3>Statement</h3>
                    <button onClick={buttonClicked}>Back</button>
                    <button onClick={viewSmart}>{toggleSmartView ? "Smart View" : "Standard View"}</button>
                    <select name="dates" id="dates" onChange={(e) => setSearchMonth(e.target.value)}>
                        <option value='' >Select Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <input placeholder="YYYY" value={searchYear} onChange={(e) => setSearchYear(e.target.value)} />
                    {((searchYear + searchMonth) === '') && <p><b>Showing the most recent statement</b></p>}
                    {(statement && transactions) ? (
                        (toggleSmartView) ? (<div>
                            <p>Statement Id: {statement.statement_id}</p>
                            <p>For Card: {card_id}</p>
                            <p>Month: {statement.month}</p>
                            <p>Year: {statement.year}</p>
                            {transactions.map(transaction => {
                                return (
                                    <div key={transaction.transaction_id} style={{ border: "1px solid black", margin: "2px" }}>
                                        <p>Transaction Id: {transaction.transaction_id}</p>
                                        <p>Amount: {transaction.amount}</p>
                                        <p>Type: {transaction.type === "C" ? "Credit" : "Debit"}</p>
                                        <p>Merchant: {transaction.merchant}</p>
                                        <p>Category: {transaction.category}</p>
                                    </div>
                                )
                            })}
                            <p>Total Payable amount: {statement.net_amount}</p>
                        </div>) : (
                            <SmartStatement searchMonth={searchMonth} searchYear={searchYear} />
                        )
                    ) : (
                        <p>{(errorMessage === "Not Found") ? "No statements present for entered month" : errorMessage}</p>
                    )
                    }
                </div>) : (
                <div>
                    <p>{errorMessage}</p>
                    <button onClick={buttonClicked}>Back</button>
                </div>
            )}
        </div>
    )
}