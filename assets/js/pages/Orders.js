import React, { useState } from 'react';
import { ORDERS_API}  from '../services/config'
import List from '../components/orders/List'

import Grid from '@material-ui/core/Grid';
import Search from '../components/orders/Search';
import Filters from '../components/orders/Filters';
import { makeStyles } from '@material-ui/core/styles';
import PageWrap from '../components/ui/PageWrap';
import RotateLeftTwoToneIcon from '@material-ui/icons/RotateLeftTwoTone';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  reset: {
    marginTop: theme.spacing(1)
  },
  filters: {
    [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
      },
  },
  filtersItem: {
    [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
      },
  }
}));

const Orders = ({match}) => {
    const classes = useStyles();
    
    const { selection } = match.params  
    const filter = selection === 'consultation' ? ORDERS_API : ORDERS_API + `?exists[${selection}]=false`

    const [toast, setToast] = useState(false) 
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState({
        code:'',
        carrier: '',
        country: ''
    })
    const [url, setUrl] = useState(filter)

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setSearch({ ...search, [name]: value });
    }

    const handleSubmit = () => {
        setUrl( getUrl() )
    }

    const handleFilter = (filter) => {
        setSearch({
            code:'',
            carrier: '',
            country: ''
        })
        setUrl( ORDERS_API + `?exists[${filter}]=false`)
    }

    const reset = () => {
        setSearch({
            code:'',
            carrier: '',
            country: ''
        })
        setUrl( ORDERS_API )
    }
    
    
    const getUrl = () => {
        const { code, carrier, country } = search
        const filters = []

        if(code === '' && carrier === '' && country === '') {
            return ORDERS_API
        }
        
        if(code !== '' ) {
            filters.push('code=' + code)
        }

        if(carrier !== '' ) {
            filters.push('carrier.name=' + carrier)
        }

        if(country !== '' ) {
            filters.push( 'firstDeliveryWarehouse.adress.country.name=' + country)
        }

        return ORDERS_API + '?' + filters.join('&')
    }

    return <PageWrap
        loading={loading}
        title='Liste des ordres de transport'
        message=''
        open={toast}
        onClose={() => {
            setToast(false)}}
    > 
        <Grid container spacing={2} justify='center'>
            <Grid item xs={12} lg={2} className={classes.filters}>
                <Grid item xs={4} lg={12} className={classes.filtersItem}>
                    <Search 
                        search={search} 
                        onChange={ handleChange } 
                        onSubmit={ handleSubmit } 
                    /> 
                </Grid>
                <Grid item xs={4} lg={12} className={classes.filtersItem}>
                    <Filters onFilter = { handleFilter } /> 
                    <Button className={classes.reset} size="small" onClick={ reset } ><RotateLeftTwoToneIcon/> Réinitialiser</Button>
                </Grid>
            </Grid>
            <Grid item>
                <List 
                    url={ url } 
                    setToast={ setToast }
                    setLoading={ setLoading }/>
            </Grid>
        </Grid>
    </PageWrap>
}
 
export default Orders;
