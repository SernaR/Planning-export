import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    color: 'red',
    width: '90%',
  },
}))

export default function Field({label, value = '', onChange}) {
  const classes = useStyles();

    return <div  noValidate autoComplete="off">
      <TextField 
            className={classes.root}
            label={label} 
            value={value}
            onChange={onChange}/>
    </div>
}