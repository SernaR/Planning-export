import React from 'react';
import ProgressBar from './ProgressBar';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width:'100%',
        //height: theme.spacing(10),
      },
    },
    title: {
      textAlign: 'center',
      fontSize: '2.4em'
  }
  }));

  
const PageWrap = ({ loading, children, title = 'Titre du document' }) => {
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
     </main>);
}
 
export default PageWrap;

//#103d51 : bleu petrole
//typo source sans Pro ou Calibri