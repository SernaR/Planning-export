import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Button from '@material-ui/core/Button';
import { NavLink, Link } from 'react-router-dom';
import { ADMIN } from '../../services/config';
import { BottomNavigationAction, BottomNavigation } from '@material-ui/core';

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
            <Button color="inherit"><a href={ ADMIN }><AccountCircle /></a></Button>
            <Button className={classes.menuButton} color="inherit"><NavLink to="/creation/nouveau">Nouveau</NavLink></Button>
            <Button className={classes.menuButton} color="inherit"><NavLink to="/planning">Planning</NavLink></Button>
            <Button className={classes.menuButton} color="inherit"><NavLink to="/liste">Liste</NavLink></Button>
          </div>   
        </Toolbar>
      </AppBar>
    </div>
  );
}

