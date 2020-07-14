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
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import PlanningList from '../components/orders/PlanningList'
import Hero from '../components/ui/Hero'

import moment from 'moment'
moment.locale("fr")

import { Link } from 'react-router-dom';
import { IconButton, Grid, Typography, Divider } from '@material-ui/core';

const dateInit = moment().weekday(0)
//const dateInit = moment().format('dddd') === 'lundi'? moment() : moment().weekday(0)

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 650,
  },
  cell: {
    cursor: 'pointer',
    '&:hover': {
      background: "#f4f4f4",
   },
  },
  table: {
    marginTop: theme.spacing(2)
  },
  planningCockpit: {
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
}))

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
      country: order.country.name
    }
  }

  return ( 
    <section className={classes.root}>
      <Hero title='Planning'/>
      
      <Grid container spacing={2} justify='center'>
        <Grid item xs={6}>
          <PlanningList orders={orders} onRemove={ fetchData }/>   
        </Grid>
        <Grid item xs={5}>
          <TableContainer component={Paper} className={classes.table}>
            <Grid container item xs={12} className={classes.planningCockpit}>
              <IconButton 
                  aria-label="before"
                  onClick={previous}>
                  <NavigateBeforeIcon />
              </IconButton>
              <Typography className={classes.title}>Semaine { monday.week() }</Typography>
              <IconButton 
                  aria-label="after"
                  onClick={next}>
                  <NavigateNextIcon />
              </IconButton> 
            </Grid>
            <Table className={classes.table} aria-label="simple table">  
              <TableHead>
                <TableRow>
                  <TableCell className={classes.title}>Destination</TableCell>
                  <TableCell className={classes.title}>{ monday.format('dddd DD') }</TableCell>
                  <TableCell className={classes.title}>{ monday.clone().add(1, 'd').format('DD/MM')}</TableCell>
                  <TableCell className={classes.title}>{ monday.clone().add(2, 'd').format('dddd DD/MM')}</TableCell>
                  <TableCell className={classes.title}>{ monday.clone().add(3, 'd').format('dddd DD')}</TableCell>
                  <TableCell className={classes.title}>{ monday.clone().add(4, 'd').format('dddd DD')}</TableCell>
                  <TableCell className={classes.title}>{ monday.clone().add(5, 'd').format('dddd DD')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planning.map((row) => (
                  <TableRow key={row.country}>
                    <TableCell >{row.country}</TableCell>
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
        </Grid>    
        
      </Grid>  
   
    </section>  
  );
}

export default Planning

