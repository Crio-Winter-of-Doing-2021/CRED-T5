import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Reminder from './Reminder';
import { default as CreditCards } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { Card } from '@material-ui/core';
import { Button } from '@material-ui/core';

export default function CreditCard({ card }) {
    const history = useHistory();
    const [reminderExists, setReminderExists] = useState(false);
    const [setReminder, setSetReminder] = useState(false);
    const buttonClicked = () => {
        history.push({
            pathname: `/cards/${card.card_id}/statements`
        });
    }
    const payBill = () => {
        history.push({
            pathname: `/cards/${card.card_id}/payment`
        });
    }
    const reminderButton = () => {
        setSetReminder(!setReminder);
    }
    useEffect(() => {
        async function checkReminderAlreadySet() {
            try {
                const token = localStorage.token;
                const response = await fetch(`http://localhost:8080/cards/${card.card_id}/reminder/check`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                const parseRes = await response.json();
                setReminderExists(parseRes);
                // check if the card already has a reminder set
                // make a check_for_reminders route in the backend
                // this route will query the database and check if any entry exists for the given card_id
                // if it does, set reminder exists to true, and thus render update reminder and delete reminder buttons instead of add reminder button
            }
            catch (err) {
                console.log(err.message);
            }
        }
        checkReminderAlreadySet();
    }, [card.card_id, reminderExists]);

    const deleteReminder = async () => {
        try {
            const token = localStorage.token;
            const response = await fetch(`http://localhost:8080/cards/${card.card_id}/reminder`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const parseRes = await response.json();
            if (parseRes.message === "Delete Successful")
                setReminderExists(false);
        } catch (err) {
            console.log(err.message);
        }
    };
    return (
        <Card variant="outlined">
            <CreditCards
                cvc=''
                expiry={card.expiry_date}
                focus=''
                name={card.name_on_card}
                number={card.card_no}
            />
            <p>Outstanding: &#8377; {card.outstanding_amount}</p>
            <button disabled={!card.outstanding_amount} onClick={payBill}>Pay Bill</button>
            <button onClick={buttonClicked}>View Statements</button>
            {reminderExists ? (<button onClick={deleteReminder}>Delete Reminder</button>
            ) : (
                <Button variant="outlined" onClick={reminderButton}>{!setReminder ? "Set Reminder" : "Cancel"}</Button>
            )}
            {setReminder && <Reminder card_id={card.card_id} reminderButton={reminderButton} setReminderExists={setReminderExists} />}
        </Card>
    )
}