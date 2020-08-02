import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';



import Button from '@material-ui/core/Button';
import { NavLink, Link } from 'react-router-dom';
import { ADMIN, LOGOUT } from '../../services/config';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  toolbar: {
    justifyContent: 'space-around'
  }
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color='primary'>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" color="inherit" className={classes.title}>
            <NavLink to="/">La Redoute</NavLink>  
          </Typography>
          <div >
            <Button className={classes.menuButton} color="inherit"><NavLink to="/creation/nouveau">Nouveau</NavLink></Button>
            <Button className={classes.menuButton} color="inherit"><NavLink to="/planning/consultation">Planning</NavLink></Button>
            <Button className={classes.menuButton} color="inherit"><NavLink to="/liste/consultation">Liste</NavLink></Button>
            <Button className={classes.menuButton} color="inherit" ><a href={ ADMIN }>Administration</a></Button>
            <Button className={classes.menuButton} color="inherit" ><a href={ LOGOUT }>Deconnexion</a></Button>
          </div>   
        </Toolbar>
      </AppBar>
    </div>
  );
}

