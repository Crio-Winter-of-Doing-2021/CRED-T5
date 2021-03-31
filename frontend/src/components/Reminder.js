import React, { useState } from 'react';

export default function Reminder({ card_id, reminderButton, setReminderExists }) {
    const [date, setDate] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const setReminder = async (e) => {
        e.preventDefault();
        try {
            const reminder_time = `${date}-${hours}-${minutes}`;
            // console.log(reminder_time);
            const body = { card_id: card_id, reminder_time: reminder_time };
            const token = localStorage.token;
            const response = await fetch(`http://localhost:8080/cards/${card_id}/reminder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
            if (parseRes.message === undefined) {
                reminderButton();
                setReminderExists(true);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <div>
            <form onSubmit={setReminder}>
                <label>Choose a date:</label>
                <select name="dates" id="dates" onChange={(e) => setDate(e.target.value)}>
                    <option value='' >Select date</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                </select>
                <div>
                    <label>Enter the time: </label>
                    <input type="text" placeholder="HH" size="2" onChange={(e) => setHours(e.target.value)} />
                    <span>:</span>
                    <input type="text" placeholder="MM" size="2" onChange={(e) => setMinutes(e.target.value)} />
                </div>
                <button type="submit">Set Reminder</button>
            </form>
        </div>
    )
}