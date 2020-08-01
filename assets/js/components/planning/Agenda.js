import React from 'react';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { makeStyles, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@material-ui/core';

const week = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    cell: {
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
        background: "#f4f4f4",
        },
    },
    table: {
        marginTop: theme.spacing(2)
    },
    planningCockpit: {
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    title: {
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
}))
  
const Agenda = ({monday, onPrevious, onNext, planning, onFilter }) => {
    const classes = useStyles();
    return  (
        <TableContainer component={Paper} className={classes.table}>
            <Grid container item xs={12} className={classes.planningCockpit}>
                <IconButton 
                    aria-label="before"
                    onClick={onPrevious}>
                    <NavigateBeforeIcon />
                </IconButton>
                <Typography className={classes.title}>Semaine { monday.week() }</Typography>
                <IconButton 
                    aria-label="after"
                    onClick={onNext}>
                    <NavigateNextIcon />
                </IconButton> 
            </Grid>
            <Table className={classes.table} aria-label="simple table">  
                <TableHead>
                    <TableRow>
                    <TableCell className={classes.title}>Destination</TableCell>
                    { week.map( day => <TableCell key={day} className={classes.title}>{ day }</TableCell>) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {planning.map((row) => (
                    <TableRow key={row.country}>
                        <TableCell >{row.country}</TableCell>
                        { week.map( day => <TableCell key={day} className={classes.cell} onClick={() => onFilter(row.country, day)}>{row[day]}</TableCell>) }
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )    
}
 
export default Agenda;


/*
jour semaine avec valeurs :
<TableCell className={classes.title}>{ monday.format('dddd') }</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(1, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(2, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(3, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(4, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(5, 'd').format('dddd')}</TableCell>
*/