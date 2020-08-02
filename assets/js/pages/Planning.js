import React, { useState, useEffect, useRef } from 'react';
import planningAPI from '../services/planningAPI'

import { Grid, makeStyles, Button } from '@material-ui/core';
import RotateLeftTwoToneIcon from '@material-ui/icons/RotateLeftTwoTone';

import moment from 'moment'
moment.locale("fr")

import PageWrap from '../components/ui/PageWrap';
import List from '../components/planning/List'
import Agenda from '../components/planning/Agenda';

const useStyles = makeStyles(theme => ({
  reset: {
    marginTop: theme.spacing(1)
  }
}))

const Planning = ({ match }) => {
  const classes = useStyles()

  const { date } = match.params  
  const dateInit = date === 'consultation' ? moment().weekday(0) : moment(date).weekday(0)
  
  const [monday, setMonday] = useState(dateInit) 
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
      const orders = await planningAPI.findAll(monday.format('DD-MM-YYYY'), monday.clone().add(6, 'd').format('DD-MM-YYYY'))
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
          <Agenda 
            monday={monday}
            onPrevious={previous}
            onNext={next}
            planning={planning}
            onFilter={filter}/>
          <Button className={classes.reset} size="small" onClick={() => setOrders(weekOrders.current)} ><RotateLeftTwoToneIcon/> Réinitialiser</Button>
        </Grid>  
        <Grid item >
          <List 
            orders={orders} 
            onRemove={ fetchData }
            setToast={setToast}/>   
        </Grid>  
      </Grid>  
    </PageWrap> 
}

export default Planning


