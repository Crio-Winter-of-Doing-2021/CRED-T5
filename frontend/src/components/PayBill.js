import React, { useState } from 'react';
// import { useHistory, useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';
import { makeStyles, Grid, Typography, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    setMargin: {
        margin: "6px"
    }
}));

export default function PayBill({ setPayOutstanding, card_id, outstanding, setTrack, track }) {
    // const history = useHistory();
    // const location = useLocation();
    // const params = location.pathname.split('/');
    // const card_id = params[2];
    const [payAmount, setPayAmount] = useState(0);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const goBack = () => {
        // history.goBack();
        setPayOutstanding(false);
    }
    const pay = async () => {
        try {
            const body = { amount: payAmount };
            const token = await localStorage.token;
            const response = await fetch(`http://localhost:8080/cards/${card_id}/pay`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
            if (parseRes.message === undefined) {
                setPaymentSuccessful(true);
                setPayOutstanding(false);
                setTrack(track + 1);
            }
            else {
                setErrorMessage(parseRes.message);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    const classes = useStyles();
    return (
        <Grid container direction="column">
            {/* <Typography color="primary">Pay your bills on time to get rewarded!</Typography> */}
            <Typography className={classes.setMargin} color="secondary">Total Outstanding: &#8377; {outstanding}</Typography>
            <Grid className={classes.setMargin}>
                <TextField autoFocus className={classes.setMargin} size="small" type="number" variant="outlined" label="Enter Amount to Pay" onChange={(e) => setPayAmount(e.target.value)} required />
                {errorMessage && <Typography className={classes.setMargin} color="error">{errorMessage}</Typography>}
            </Grid>
            <Grid className={classes.setMargin}>
                <Button className={classes.setMargin} onClick={pay} variant="outlined" color="primary">Pay Amount</Button>
                <Button className={classes.setMargin} onClick={goBack} variant="outlined" >Cancel</Button>
            </Grid>
            {paymentSuccessful && <Redirect to={{ pathname: "/cards" }} />}
        </Grid>
    )
}