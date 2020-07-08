import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '90%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Selection({ name, items = [], onChange, label, error }) {
  const classes = useStyles();
  const [item, setItem] = React.useState('');

  const handleChange = ({target}) => {
    onChange(target)
    setItem(target.value);
  };

  return (
    <div>
      <FormControl className={classes.root} error={error}>
        <InputLabel >{label}</InputLabel>
        <Select
          value={item}
          name={name}
          onChange={handleChange}
          label="Item"
        >
          {items.map (item => <MenuItem key={item.id} value={ item['@id'] || item.id }>{item.name}</MenuItem>)}  
        </Select>
      </FormControl>
    </div>
  );
}