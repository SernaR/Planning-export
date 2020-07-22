import React, { useState } from 'react';
import { ORDERS_API}  from '../services/config'
import List from '../components/orders/List'
import Hero from '../components/ui/Hero'

import Grid from '@material-ui/core/Grid';
import Search from '../components/orders/Search';
import Filters from '../components/orders/Filters';
import { makeStyles } from '@material-ui/core/styles';
import PageWrap from '../components/ui/PageWrap';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Orders = (props) => {
    const classes = useStyles();

    const [toast, setToast] = useState(false) 
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState({
        code:'',
        carrier: '',
        country: ''
    })
    const [url, setUrl] = useState(ORDERS_API)

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setSearch({ ...search, [name]: value });
    }

    const handleSubmit = () => {
        setUrl( getUrl() )
    }

    const handleFilter = (filter) => {
        setUrl( ORDERS_API + `?exists[${filter}]=false`)
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
            <Grid item xs={3}>
                <Search 
                    search={search} 
                    onChange={ handleChange } 
                    onSubmit={ handleSubmit } 
                /> 
                <Filters onFilter = { handleFilter } /> 
            </Grid>
            <Grid item xs={8}>
                <List 
                    url={ url } 
                    setToast={ setToast }
                    setLoading={ setLoading }/>
            </Grid>
        </Grid>
    </PageWrap>
}
 
export default Orders;
