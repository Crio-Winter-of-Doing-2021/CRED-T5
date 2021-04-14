import React from 'react';
import { withStyles, TableCell, TableRow, Button } from '@material-ui/core';

export default function Reward({ reward, coin_bal }) {
    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);
    const { cost, reward_id, body } = reward;
    const buyReward = async () => {
        console.log("123");
        const token = localStorage.token;
        try {
            const response = await fetch(`http://localhost:8080/rewards/buy/${reward_id}`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            const parseRes = await response.json();
            console.log(parseRes);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                    {body}
                </StyledTableCell>
                <StyledTableCell align="right">{cost}</StyledTableCell>
                <StyledTableCell align="right" ><Button onClick={() => { buyReward() }} variant="outlined" color="primary" disabled={cost > coin_bal}>Redeem</Button></StyledTableCell>
            </StyledTableRow>
            {/* <div style={{ border: "1px solid black" }}>
                <button onClick={buyReward}>Redeem</button>
                <p>{body}</p>
                <p>{cost}</p>
            </div> */}
        </>
    )
}