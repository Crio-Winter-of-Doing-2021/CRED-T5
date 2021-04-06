import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Reminder from './Reminder';

export default function Card({ card }) {
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
                // check if the card already has a reminder set
                // make a check_for_reminders route in the backend
                // this route will query the database and check if any entry exists for the given card_id
                // if it does, set reminder exists to true, and thus render update reminder and delete reminder buttons instead of add reminder button
                const response = await fetch(`http://localhost:8080/cards/${card.card_id}/reminder/check`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                const parseRes = await response.json();
                if (parseRes.message === undefined)
                    setReminderExists(parseRes);
                else setReminderExists(false);
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
        <div style={{ border: "1px solid black" }}>
            <p>Card No.: {card.card_no}</p>
            <p>Card holder: {card.name_on_card}</p>
            <p>Expiry Date: {card.expiry_date}</p>
            <p>Outstanding: &#8377; {card.outstanding_amount}</p>
            <button disabled={!card.outstanding_amount} onClick={payBill}>{(card.outstanding_amount) ? "Pay Bill" : "Fully Paid"}</button>
            <button onClick={buttonClicked}>View Statements</button>
            {reminderExists ? (<button onClick={deleteReminder}>Delete Reminder</button>
            ) : (
                <button onClick={reminderButton}>{!setReminder ? "Set Reminder" : "Cancel"}</button>
            )}
            {setReminder && <Reminder card_id={card.card_id} reminderButton={reminderButton} setReminderExists={setReminderExists} />}
        </div >
    )
}