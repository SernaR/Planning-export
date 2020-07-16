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
  }));

  
const PageWrap = ({ loading, children, title = 'Titre du document' }) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return ( <main>
        { loading && <ProgressBar /> || <div style={{height: '4px' }}></div>}
        <div className={classes.root}>
            <Card>
                <CardContent >
                    <Typography variant='h3' align='center'>{title}</Typography>
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