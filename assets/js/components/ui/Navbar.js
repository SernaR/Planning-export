import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { NavLink, Link } from 'react-router-dom';
import { ADMIN } from '../../services/config';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar >
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            <NavLink to="/">La Redoute</NavLink>  
          </Typography>
          <Button color="inherit"><NavLink to="/ordres/creation">Nouveau</NavLink></Button>
          <Button color="inherit"><NavLink to="/planning">Planning</NavLink></Button>
          <Button color="inherit"><NavLink to="/ordres/liste">Liste</NavLink></Button>
          <Button color="inherit"><a href={ ADMIN }>Admin</a></Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
