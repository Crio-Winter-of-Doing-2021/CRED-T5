import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Reminder from './Reminder';
import { default as CreditCards } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { Card, Grid, CardContent, CardActions, makeStyles, Modal } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { CardMedia } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        height: 350,
        outline: "none",
        backgroundColor: theme.palette.background.paper,
        border: '0px solid black',
        borderRadius: "10px",
        padding: theme.spacing(2, 4, 3),
    },
    btn: {
        width: "40%",
        margin: "1px",
        padding: "2px"
    }
}));

export default function CreditCard({ card }) {
    const classes = useStyles();
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

    function getModalStyle() {
        const top = 50;
        const left = 50;
        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    const [modalStyle] = React.useState(getModalStyle);
    const handleClose = () => {
        setSetReminder(false);
    };

    const modalBody = (
        <div style={modalStyle} className={classes.paper}>
            <Reminder card_id={card.card_id} reminderButton={reminderButton} setReminderExists={setReminderExists} />
        </div>
    );

    return (
        <Grid item align="center" md={6} sm={12}>
            <Card elevation={2}>
                <Modal
                    open={setReminder}
                    onClose={handleClose}
                >
                    {modalBody}
                </Modal>
                <CardMedia style={{margin:"4.25%"}}>
                    <CreditCards
                        cvc=''
                        expiry={card.expiry_date}
                        focus=''
                        name={card.name_on_card}
                        number={card.card_no}
                    />
                </CardMedia>
                <CardContent>
                    <Grid style={{ margin: "4px" }} container direction="row" justify="space-evenly" alignItems="center">
                        <Grid item>
                            <Typography color="secondary">
                                Outstanding: &#8377; {card.outstanding_amount}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button size="medium" variant="outlined" color="primary" disabled={!card.outstanding_amount} onClick={payBill}>{card.outstanding_amount ? "Pay Bill" : "Fully Paid"}</Button>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container direction="column">
                        <Grid item>
                            <Button className={classes.btn} size="medium" variant="outlined" color="primary" onClick={buttonClicked}>View Statement</Button>
                        </Grid>
                        <Grid item>
                            {
                                reminderExists ? (<Button className={classes.btn} size="medium" color="secondary" variant="outlined" onClick={deleteReminder}>Delete Reminder</Button>
                                ) : (
                                    <Button className={classes.btn} size="medium" color="primary" variant="outlined" onClick={reminderButton}>{!setReminder ? "Set Reminder" : "Cancel"}</Button>
                                )
                            }
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid >
    )
}