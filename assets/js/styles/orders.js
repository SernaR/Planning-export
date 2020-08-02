import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
    card: {
        marginTop: theme.spacing(2),
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
        marginBottom: theme.spacing(2),
        width: '100%'
      },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    button: {
        textTransform: 'capitalize'
    },
    button2: {
        background: '#f4f4f4',
        marginTop: '1em',
        textTransform: 'capitalize'
    },
  }))