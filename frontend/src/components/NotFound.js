import React from 'react';
import { makeStyles, Typography, Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    image: {
        width: "500px",
        height: "auto"
    },
    grid: {
        marginTop: "3%"
    }
}));

export default function NotFound() {
    const classes = useStyles();
    return (
        <Grid className={classes.grid} container direction="column" alignItems="center">
            <Grid item>
                <img className={classes.image} src="https://images.all-free-download.com/images/graphiclarge/error_404_page_not_found_6845510.jpg" alt="imgae" />
            </Grid>
            <Grid container direction="column" alignItems="center">
                <Grid>
                <Typography variant="h2" color="primary">404</Typography>
                </Grid>
                <Grid>
                <Typography variant="h5" color="primary">Page Not Found</Typography>
                </Grid>
            </Grid>
            <Grid>
                <Button style={{margin:"20px"}} component={Link} to="/cards" variant="contained" color="primary">Dashboard</Button>
            </Grid>
        </Grid>
    )
}