import React, { useState } from 'react';
import { MenuItem, Select, TextField, FormControl, InputLabel, makeStyles, Button, Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
        // height: "4px"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function Reminder({ card_id, reminderButton, setReminderExists }) {
    const classes = useStyles();
    const [date, setDate] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const setReminder = async (e) => {
        e.preventDefault();
        try {
            const reminder_time = `${date}-${hours}-${minutes}`;
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
            else setErrorMessage(parseRes.message);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <Grid>
            <Grid>
                <Typography variant="body1" color="primary">Get reminders delivered to your mail,</Typography>
                <Typography variant="body1" color="primary">On the day you want,</Typography>
                <Typography variant="body1" color="primary">So you never miss a due date:)</Typography>
            </Grid>
            <form onSubmit={setReminder}>
                <Grid>
                    <Grid container direction="column" align="center">
                        <Grid item>
                            <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel>Day of Month</InputLabel>
                                <Select value={date} onChange={(e) => setDate(e.target.value)}>
                                    <MenuItem value='' >''</MenuItem>
                                    <MenuItem value="01">01</MenuItem>
                                    <MenuItem value="02">02</MenuItem>
                                    <MenuItem value="03">03</MenuItem>
                                    <MenuItem value="04">04</MenuItem>
                                    <MenuItem value="05">05</MenuItem>
                                    <MenuItem value="06">06</MenuItem>
                                    <MenuItem value="07">07</MenuItem>
                                    <MenuItem value="08">08</MenuItem>
                                    <MenuItem value="09">09</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="11">11</MenuItem>
                                    <MenuItem value="12">12</MenuItem>
                                    <MenuItem value="13">13</MenuItem>
                                    <MenuItem value="14">14</MenuItem>
                                    <MenuItem value="15">15</MenuItem>
                                    <MenuItem value="16">16</MenuItem>
                                    <MenuItem value="17">17</MenuItem>
                                    <MenuItem value="18">18</MenuItem>
                                    <MenuItem value="19">19</MenuItem>
                                    <MenuItem value="20">20</MenuItem>
                                    <MenuItem value="21">21</MenuItem>
                                    <MenuItem value="22">22</MenuItem>
                                    <MenuItem value="23">23</MenuItem>
                                    <MenuItem value="24">24</MenuItem>
                                    <MenuItem value="25">25</MenuItem>
                                    <MenuItem value="26">26</MenuItem>
                                    <MenuItem value="27">27</MenuItem>
                                    <MenuItem value="28">28</MenuItem>
                                    <MenuItem value="29">29</MenuItem>
                                    <MenuItem value="30">30</MenuItem>
                                    <MenuItem value="31">31</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item style={{margin:"10px"}}>
                            <TextField type="text" placeholder="HH (24 hrs)" size="small" onChange={(e) => setHours(e.target.value)} />
                        </Grid>
                        <Grid item style={{margin:"10px"}}>
                            <TextField type="text" placeholder="MM (minutes)" size="small" onChange={(e) => setMinutes(e.target.value)} />
                        </Grid>
                        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    </Grid>
                    <Grid align="center" style={{margin: "20px auto"}}>
                        <Button variant="outlined" color="primary" type="submit">Set Reminder</Button>
                    </Grid>
                </Grid>
            </form >
        </Grid >
    )
}