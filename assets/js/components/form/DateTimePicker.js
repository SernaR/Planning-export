import React from "react";
import { KeyboardDateTimePicker, DateTimePicker } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
      width: '90%',
      margin: theme.spacing(1),
    },
  }))

function Picker({ label, minDate, onChange, name, value=null, error, disablePast=false }) {
    const classes = useStyles();    
    const checkDate = (value && value <= minDate ) || error
    
    return (
        <DateTimePicker
            className={classes.root}
            variant="inline"
            ampm={false}
            label={label}
            value={value}
            onChange={date =>onChange(name, date)}
            error={checkDate}
            disablePast={disablePast}
            minDate={minDate}
            format='DD/MM/YYYY HH:mm'
        />
    );
}

export default Picker;