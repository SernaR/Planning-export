import React, { useState, useEffect, useRef } from 'react';
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
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import PlanningList from '../components/orders/PlanningList'
import Hero from '../components/ui/Hero'

import moment from 'moment'
moment.locale("fr")

import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';

const dateInit = moment().format('dddd') === 'lundi'? moment() : moment().weekday(-7)

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

const Planning = (props) => {
  const classes = useStyles();
  const [monday, setMonday] = useState(dateInit)
  const [planning, setPlanning] = useState([])
  const [orders, setOrders] = useState([])
  const weekOrders = useRef([])

  useEffect(() => {
    fetchData()
  },[monday])

  const fetchData = async() => {
    const rows = []
    const countries = []
  
    try{
      const orders = await ordersAPI.planning(monday.format('DD-MM-YYYY'), monday.clone().add(6, 'd').format('DD-MM-YYYY'))
      if(orders) {
        orders.map( order => {
          const {date, country} = getData(order)
          const index = countries.indexOf(country)
          const newCountry = index === -1

          if(newCountry) {
            countries.push(country)
            rows.push( {country, [date]: 1} )
          } else {
            rows[index][date]? rows[index][date]++ : rows[index][date] = 1
          }
        })
        weekOrders.current = orders
        setOrders(orders) 
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

  const filter = (selectedCountry, selecteDate) => {
    const filteredOrders = weekOrders.current.filter( order => {
      const {date, country} = getData(order)
      return date === selecteDate && country === selectedCountry
    })
   setOrders(filteredOrders)
  }

  const getData = order => {
    return {
      date: moment(order.firstLoadingStart).format('dddd'),
      country: order.firstDeliveryWarehouse.adress.country.name
    }
  }

  return ( <>
    <Hero/>
    <Container fixed>
       <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            <IconButton 
                aria-label="before"
                onClick={previous}>
                <NavigateBeforeIcon />
            </IconButton>
            <span>Semaine { monday.week() }</span>
            <IconButton 
                aria-label="after"
                onClick={next}>
                <NavigateNextIcon />
            </IconButton>
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
                <TableCell align="center" className={classes.cell} onClick={() => filter(row.country, 'lundi')}>{row.lundi}</TableCell>
                <TableCell align="center" className={classes.cell} onClick={() => filter(row.country, 'mardi')}>{row.mardi}</TableCell>
                <TableCell align="center" className={classes.cell} onClick={() => filter(row.country, 'mercredi')}>{row.mercredi}</TableCell>
                <TableCell align="center" className={classes.cell} onClick={() => filter(row.country, 'jeudi')}>{row.jeudi}</TableCell>
                <TableCell align="center" className={classes.cell} onClick={() => filter(row.country, 'vendredi')}>{row.vendredi}</TableCell>
                <TableCell align="center" className={classes.cell} onClick={() => filter(row.country, 'samedi')}>{row.samedi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PlanningList orders={orders} onRemove={ fetchData }/>     
    </Container>
    </>  
  );
}

export default Planning

