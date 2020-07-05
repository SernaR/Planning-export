import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
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
  form: {
    margin: '1em auto',
  },
  field: {
    marginBottom: '1em',
    width: '100%'
  },
  button: {
      background: '#f4f4f4',
      textTransform: 'capitalize'
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
})

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
                    className={classes.field}
                    variant="outlined"
                    label={field.placeholder}
                    name={field.name}
                    value={search[field.name]}
                    onChange={onChange}  
                />
                    
            ))}
                <Button 
                className={classes.button}
                variant="outlined" 
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



