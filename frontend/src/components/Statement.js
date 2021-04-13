import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import SmartStatement from './SmartStatement';
import { TableContainer, InputLabel, withStyles, makeStyles, Paper, Container, TextField, Select, MenuItem, Typography, Button, Table, TableBody, TableCell, TableRow, TableHead, Grid } from '@material-ui/core';
import { TablePagination } from '@material-ui/core';
import { FormControl } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    title: {
        flexGrow: 1,
        padding: "8px",
    },
    table: {
        minWidth: 700,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 120,
    }
}));

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const viewSmart = () => {
        setToggleSmartView(!toggleSmartView);
    }
    const handleChangeRowsPerPage = e => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }
    const clearSearch = () => {
        setSearchMonth('');
        setSearchYear('');
    }
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
        <Container className={classes.container}>
            {(searchYear + searchMonth) !== '' || (statement && transactions) ? (
                <Grid>
                    {/* <Button onClick={buttonClicked}>Back</Button> */}
                    <Grid style={{ marginBottom: "20px" }} container direction="row" justify="space-evenly" alignItems="center">
                        <Grid item>
                            <Typography color="textSecondary">
                                looking for something in a previous statement? search by month and year here
                            </Typography>
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="searchMonthLabel" >Select Month</InputLabel>
                                <Select labelId="searchMonthLabel"
                                    value={searchMonth} onChange={(e) => setSearchMonth(e.target.value)}>
                                    <MenuItem selected value="" >Select Month</MenuItem>
                                    <MenuItem value="01">January</MenuItem>
                                    <MenuItem value="02">February</MenuItem>
                                    <MenuItem value="03">March</MenuItem>
                                    <MenuItem value="04">April</MenuItem>
                                    <MenuItem value="05">May</MenuItem>
                                    <MenuItem value="06">June</MenuItem>
                                    <MenuItem value="07">July</MenuItem>
                                    <MenuItem value="08">August</MenuItem>
                                    <MenuItem value="09">September</MenuItem>
                                    <MenuItem value="10">October</MenuItem>
                                    <MenuItem value="11">November</MenuItem>
                                    <MenuItem value="12">December</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <TextField placeholder="Enter Year(YYYY)" value={searchYear} onChange={(e) => setSearchYear(e.target.value)} />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Button onClick={clearSearch}>Clear Search</Button>
                        </Grid>
                    </Grid>
                    <Grid style={{ marginTop: "5px" }} container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography className={classes.title} component="h2" variant="h6" color="primary" gutterBottom>
                                Credit Card Transactions for {months[parseInt(statement.month) - 1]} {statement.year}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={viewSmart} size="large">{toggleSmartView ? "Smart View" : "Standard View"}</Button>
                        </Grid>
                    </Grid>
                    {/* {((searchYear + searchMonth) === '') && <Typography>Showing the most recent statement</Typography>} */}
                    {(statement && transactions) ? (
                        (toggleSmartView) ? (<Grid>
                            {/* was present here */}
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <StyledTableRow hover>
                                                {/* <TableCell>Transaction Id</TableCell> */}
                                                <StyledTableCell component="th" scope="row">Merchant</StyledTableCell>
                                                <StyledTableCell align="right">Amount</StyledTableCell>
                                                <StyledTableCell align="right">Type</StyledTableCell>
                                                <StyledTableCell align="right">Category</StyledTableCell>
                                                {/* <StyledTableCell>Date</StyledTableCell> */}
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transactions
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map(transaction => {
                                                    return (
                                                        <StyledTableRow key={transaction.transaction_id}>
                                                            {/* <StyledTableCell>Transaction Id: {transaction.transaction_id}</StyledTableCell> */}
                                                            <StyledTableCell component="th" scope="row">{transaction.merchant}</StyledTableCell>
                                                            <StyledTableCell align="right">{transaction.amount}</StyledTableCell>
                                                            <StyledTableCell align="right">{transaction.type === "C" ? "Credit" : "Debit"}</StyledTableCell>
                                                            <StyledTableCell align="right">{transaction.category}</StyledTableCell>
                                                        </StyledTableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={transactions.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </Grid>
                            <Typography style={{ margin: "20px" }} color="primary">Total Payable amount: {statement.net_amount} INR</Typography>
                        </Grid>) : (
                            <SmartStatement searchMonth={searchMonth} searchYear={searchYear} />
                        )
                    ) : (
                        <Typography>{(errorMessage === "Not Found") ? "No statements present for entered month" : errorMessage}</Typography>
                    )
                    }
                </Grid>) : (
                <Grid>
                    <Typography color="error">{errorMessage}</Typography>
                    <Button onClick={buttonClicked}>Back</Button>
                </Grid>
            )}
        </Container >
    )
}