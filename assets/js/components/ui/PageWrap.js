import React from 'react';
import ProgressBar from './ProgressBar';
import { Card, CardContent, Typography, makeStyles, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width:'100%',
      },
    },
    title: {
      textAlign: 'center',
      fontSize: '2.4em'
  }
  }));

  
const PageWrap = ({ loading, children, title = 'Titre du document', open, onClose, message  }) => {
    const classes = useStyles();
  
    return ( <main>
        { loading && <ProgressBar /> || <div style={{height: '4px' }}></div>}
        <div className={classes.root}>
            <Card>
                <CardContent >
                    <Typography className={classes.title}>{title}</Typography>
                </CardContent>
            </Card> 
        </div>
        <section>
            {children}
        </section>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          //autoHideDuration={6000}
          onClose={onClose}
          message={ message === '' ? "Oups, une erreur est survenue" : message }
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
     </main>);
}
 
export default PageWrap;

