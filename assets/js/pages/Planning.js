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
import RotateLeftTwoToneIcon from '@material-ui/icons/RotateLeftTwoTone';

import PlanningList from '../components/orders/PlanningList'

import moment from 'moment'
moment.locale("fr")

import { IconButton, Grid, Typography, Divider, Collapse, Button } from '@material-ui/core';
import PageWrap from '../components/ui/PageWrap';

const dateInit = moment().weekday(0)
const week = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  cell: {
    textAlign: 'center',
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
  },
  reset: {
    marginTop: theme.spacing(1)
  }
}))

const Planning = (props) => {
  const classes = useStyles();
  const [monday, setMonday] = useState(dateInit) //params.monday || dateinit ??
  const [planning, setPlanning] = useState([])
  const [orders, setOrders] = useState([])

  const weekOrders = useRef([])

  const [toast, setToast] = useState(false) 
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  },[monday])

  const fetchData = async() => {
    const rows = []
    const countries = []
    setLoading(true)

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
      setToast(true)
    }
    setLoading(false)
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
    if(filteredOrders.length > 0) setOrders(filteredOrders)
  }

  const getData = order => {
    return {
      date: moment(order.firstLoadingStart).format('dddd'),
      country: order.country.name
    }
  }

  return <PageWrap
    loading={loading}
    title={ `Planning du ${monday.format('DD/MM') || ''} au ${monday.clone().add(5, 'd').format('DD/MM') || ''}`}
    open={toast}
    message=''
    onClose={() => setToast(false)}
    > 
      <Grid container spacing={2} justify='center'>
        <Grid item >
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
                  { week.map( day => <TableCell key={day} className={classes.title}>{ day }</TableCell>) }
                </TableRow>
              </TableHead>
              <TableBody>
                {planning.map((row) => (
                  <TableRow key={row.country}>
                    <TableCell >{row.country}</TableCell>
                    { week.map( day => <TableCell key={day} className={classes.cell} onClick={() => filter(row.country, day)}>{row[day]}</TableCell>) }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button className={classes.reset} size="small" onClick={() => setOrders(weekOrders.current)} ><RotateLeftTwoToneIcon/> Réinitialiser</Button>
        </Grid>  
        <Grid item >
          <PlanningList orders={orders} onRemove={ fetchData }/>   
        </Grid>  
      </Grid>  
    </PageWrap> 
}

export default Planning

/*
jour semaine avec valeurs :
<TableCell className={classes.title}>{ monday.format('dddd') }</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(1, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(2, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(3, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(4, 'd').format('dddd')}</TableCell>
<TableCell className={classes.title}>{ monday.clone().add(5, 'd').format('dddd')}</TableCell>
*/

