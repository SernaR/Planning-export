import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: '1em',
        //maxWidth: 345,
    },
        cardContent: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        margin: 'auto'
    },  

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    button: {
        background: '#f4f4f4',
        marginTop: '1em',
        textTransform: 'capitalize'
    },
}));


export default function Filters({ onFilter }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            <Typography 
              component="div"
              className={classes.title}>
              Filtres
            </Typography>
         
            <Button 
                variant="outlined" 
                onClick={() => onFilter('effectiveFirstLoadingStart')} 
                className={classes.button}
                fullWidth  >
                A confirmer
            </Button>
            <Button 
                variant="outlined" 
                onClick={() => onFilter('invoice')} 
                className={classes.button}
                fullWidth  >
                A régler
            </Button>
        </CardContent>    
    </Card>
  );
}



