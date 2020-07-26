import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    width: '90%',
  },
}))

export default function Field({label, value = '', name, onChange, variant = 'standard', unit= null, error, multiline=false}) {
  const classes = useStyles();

  return <div  noValidate autoComplete="off">
    <TextField 
        className={classes.root}
        variant={variant}
        size="small"
        multiline={multiline}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        InputProps={unit && {
          endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
        }}/>
  </div>
}

