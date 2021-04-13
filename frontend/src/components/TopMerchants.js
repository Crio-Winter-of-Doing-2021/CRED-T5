import React from 'react';
import { makeStyles, withStyles, Typography, Grid, Paper, TableContainer, Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import TopMerchantsGraph from './TopMerchantsGraph';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        padding: "8px",
    },
    table: {
        minWidth: 300,
    },
    grid: {
        marginTop: "10px",
        marginBottom: "20px"
    }
}));

export default function TopMerchants({ merchants }) {
    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.action.hover,
            // color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
        // root: {
        // '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,
        // },
        // },
    }))(TableRow);
    const classes = useStyles();
    return (
        <Grid className={classes.grid}>
            <Typography className={classes.title} component="h2" variant="h5" color="secondary" gutterBottom>
                Top Merchants
            </Typography>
            <Grid container direction="row" justify="space-between" align="center">
                <Grid item md={6}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <StyledTableRow hover>
                                    <StyledTableCell component="th" scope="row">Name</StyledTableCell>
                                    <StyledTableCell align="right">Amount Spent (&#8377;)</StyledTableCell>
                                    <StyledTableCell align="right">Percentage</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {merchants
                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((merchant) => {
                                        return (
                                            <StyledTableRow key={merchant.merchant}>
                                                <StyledTableCell component="th" scope="row">{merchant.merchant}</StyledTableCell>
                                                <StyledTableCell align="right">{merchant.amount_spent}</StyledTableCell>
                                                <StyledTableCell align="right">{merchant.percentage}%</StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item md={6}>
                    <TopMerchantsGraph merchants={merchants} />
                </Grid>
            </Grid >
        </Grid>
    )
}
