import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width:'100%',
      height: theme.spacing(10),
    },
  },
}));

export default function Hero({ title = 'Titre du document'}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
          <CardContent >
              <Typography align='center' variant='h2'>{title}</Typography>
          </CardContent>
      </Card> 
    </div>
  );
}

//#103d51 : bleu petrole
//typo source sans Pro ou Calibri


