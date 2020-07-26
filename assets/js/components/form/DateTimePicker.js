import React from "react";
import { DateTimePicker } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  root: {
      width: '90%',
      margin: theme.spacing(1),
    },
  }))

function Picker({ label, minDate, maxDate, onChange, name, value=null, error, disablePast=false, disabled=false }) {
    const classes = useStyles();    
    const isErrorDate = (value && minDate && moment(value) <= moment(minDate) ) || error
    
    return (
        <DateTimePicker
            className={classes.root}
            variant="inline"
            ampm={false}
            label={label}
            value={value}
            onChange={date =>onChange(name, date)}
            error={isErrorDate}
            disablePast={disablePast}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            format='DD/MM/YYYY HH:mm'
        />
    );
}

export default Picker;