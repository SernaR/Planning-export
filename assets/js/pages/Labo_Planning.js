import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { COUNTRY_API } from '../services/config'
import fetcher from '../services/api'
import ordersAPI from '../services/ordersAPI'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import moment from 'moment'
moment.locale('fr')

import { Link } from 'react-router-dom';

//const week = moment().week()
const dateInit = moment().format('dddd') === 'lundi'? moment() : moment().weekday(-7)
//const monday = dateInit.format('DD-MM-YYYY')
//const date = dateInit.format('DD')

//console.log(dateInit)

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  cell: {
    cursor: 'pointer',
    '&:hover': {
      background: "#f4f4f4",
   },
  },
  card: {
    margin: '1em auto'
  },
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
 },
});

function createData(country, lundi, mardi, mercredi, jeudi, vendredi, samedi) {
  return { country, lundi, mardi, mercredi, jeudi, vendredi, samedi };
}

/*const rows = [
  //createData('Portugal', 0, 0, 0, 0, 0, 0),
  //createData('Italie', 0, 0, 0, 0, 0, 0),
  //createData('Espagne', 0, 0, 0, 0, 0, 0),
  //createData('Russie',  0, 0, 0, 0, 0, 0),
  //createData('Suisse',  0, 0, 0, 0, 0, 0),
];*/
//const countriesTest = ['Portugal', 'Italie', 'Espagne', 'Russie', 'Suisse'] //-->useSWR
//console.log(countriesTest.indexOf('Portugal'))
/*
const results = [{country:'France', date:'lundi'}, {country:'France', date:'lundi'}, {country:'Portugal', date:'mercredi'}]
  results.map( result => {
    //const date = moment(result.firstLoadingStart).format('dddd')
    const country = countriesTest.indexOf(result.country)
    rows[country][result.date]++
  })*/

//console.log(rows)

const Planning = (props) => {
  const classes = useStyles();
  const [monday, setMonday] = useState(dateInit)
  const [planning, setPlanning] = useState([])

  //console.log(moment("2020-07-05T13:00:00+00:00").format('dddd'))

  const { data, error } = useSWR( COUNTRY_API, fetcher )
  const countries = []

  if(data) {
      data["hydra:member"].map( d => countries.push(d.country.name)) //revoir la RQT sur countries
  } //useMemo
 
  
  useEffect(() => {
    fetchData()
  },[data, monday])

  const fetchData = async() => {
    const rows = []
    countries.map( country => {
      rows.push(createData(country, 0, 0, 0, 0, 0, 0))
    }) 
    try{
      const orders = await ordersAPI.planning(monday.format('DD-MM-YYYY'), monday.clone().add(5, 'd').format('DD-MM-YYYY'))
      if(orders) {
        orders.map( order => {
          const date = moment(order.firstLoadingStart).format('dddd')
          const country = countries.indexOf(order.firstDeliveryWarehouse.adress.country.name)
          rows[country][date]++
        })
      }
    } catch(err){
        console.log(err.response)
    }
    setPlanning(rows)
  }

  const next = () => {
    setMonday(monday.clone().add(7, 'days'))
  }

  const previous = () => {
    setMonday(monday.clone().subtract(7, 'days'))
  }
 
  return (
    <Container fixed>
       <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            <Button onClick={previous}>{'<<'}</Button>
            <span>Semaine { monday.week() }</span>
            <Button onClick={next}>{'>>'}</Button>
          </CardContent>
      </Card>    
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">  
          <TableHead>
            <TableRow>
              <TableCell>Destination</TableCell>
              <TableCell align="center">{ monday.format('dddd DD') }</TableCell>
              <TableCell align="center">{ monday.clone().add(1, 'd').format('dddd DD')}</TableCell>
              <TableCell align="center">{ monday.clone().add(2, 'd').format('dddd DD')}</TableCell>
              <TableCell align="center">{ monday.clone().add(3, 'd').format('dddd DD')}</TableCell>
              <TableCell align="center">{ monday.clone().add(4, 'd').format('dddd DD')}</TableCell>
              <TableCell align="center">{ monday.clone().add(5, 'd').format('dddd DD')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planning.map((row) => (
              <TableRow key={row.country}>
                <TableCell component="th" scope="row">
                  {row.country}
                </TableCell>
                <TableCell align="center" className={classes.cell}>{row.lundi}</TableCell>
                <TableCell align="center" className={classes.cell}>{row.mardi}</TableCell>
                <TableCell align="center" className={classes.cell}>{row.mercredi}</TableCell>
                <TableCell align="center" className={classes.cell}>{row.jeudi}</TableCell>
                <TableCell align="center" className={classes.cell} onClick={() => alert('plop')}>{row.vendredi}</TableCell>
                <TableCell align="center" className={classes.cell} ><Link to={'/ordres/facturation/ordre/4'}>{row.samedi}</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>  
  );
}

export default Planning

/*




            */