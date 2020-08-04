import React from 'react';

import { useStyles } from '../../styles/orders'

import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const fields = [
    { name: 'code', placeholder: 'Ordre de transport'},
    { name: 'carrier', placeholder: 'Transporteur'},
    { name: 'country', placeholder: 'Pays'},
]

export default function Search({ search, onChange, onSubmit }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            <Typography 
            component="div"
            className={classes.title}>
            Recherche
            </Typography>
            <form className={classes.form} noValidate>

            {fields.map((field, index) => (  
                <TextField key={index}
                    className={classes.input}
                    variant="outlined"
                    size="small"
                    label={field.placeholder}
                    name={field.name}
                    value={search[field.name]}
                    onChange={onChange}  
                />
                    
            ))}
                <Button 
                  className={classes.button}
                  variant="contained"
                  color="primary" 
                  onClick={onSubmit} 
                  startIcon={<SearchIcon />}
                  fullWidth  >
                  Rechercher
                </Button>
            </form>
        </CardContent>        
    </Card>
  );
}



