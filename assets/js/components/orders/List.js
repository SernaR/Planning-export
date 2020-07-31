import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paginate from '../ui/Paginate';
import { Link } from 'react-router-dom';

import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, Backdrop, CircularProgress  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    container: {
      margin: '1em auto',
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      width: '80%',
      margin: 'auto'
    },
    button: {
        textTransform: 'capitalize'
    },
    title: {
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
  }))

const List = ({url, setLoading, setToast }) => {
    const classes = useStyles()
    
    const [totalItems, setTotalItems] = useState(0);
    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect( () => {
        fetchData( currentPage, url )
    },  [currentPage] );

    useEffect( () => {
        fetchData( 1, url )
        setCurrentPage(1)
    },  [url] );
    
    const fetchData = ( page, url ) => {
        setLoading(true);
        const and = url.includes('?') ? '&' : '?'

        axios.get(url + and + 'order[firstLoadingStart]=desc&page=' + page)
            .then( response => {
                setOrders(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false)
            })
            .catch(error => {
                setToast(true)
                setLoading(false)
            })
    }

    const handlePageChange = (page) => setCurrentPage(page);

    const fulfilled = (id, loaded) => {
        //status annulé -> disabled
        let text = 'A confirmer'
        let status = 'contained'
        if(loaded) {
            text = 'Réalisé'
            status = 'outlined'
        }
        return <Link to={'/annonce/ordre/' + id}><Button className={classes.button} size="small" variant={status}>{text}</Button></Link>
    }

    const bill = (id, paid) => {
        let text = 'A régler'
        let status = 'contained'
        if(paid) {
            text = 'Facturé'
            status = 'outlined'
        }
        return <Link to={'/facturation/ordre/' + id}><Button className={classes.button} size="small" variant={status}>{text}</Button></Link>
    }
    
    return <>
        <TableContainer className={classes.container} component={Paper}>
            <Table size="small" aria-label="table">
                <TableHead>
                    <TableRow >
                        <TableCell className={classes.title}>Ordre N°</TableCell>
                        <TableCell className={classes.title}>Pays</TableCell>
                        <TableCell className={classes.title}>Entrepôts</TableCell>
                        <TableCell className={classes.title}>Transporteur</TableCell>
                        <TableCell className={classes.title}>Date</TableCell>
                        <TableCell className={classes.title}>statut</TableCell>
                        <TableCell className={classes.title}>Confirmation</TableCell>
                        <TableCell className={classes.title}>Facturation</TableCell>
                    </TableRow>
                </TableHead>
            
                <TableBody>
                    {orders.map( (order, key) => 
                        <TableRow hover role="checkbox" key={key}>
                            <TableCell>{ order.code }</TableCell>
                            <TableCell>{ order.country.name }</TableCell> 
                            <TableCell>{ order.firstLoadingWarehouse.name }{order.secondLoadingWarehouse && ' + ' +  order.secondLoadingWarehouse.name }</TableCell>
                            <TableCell>{ order.carrier.name }</TableCell>
                            <TableCell>{ moment(order.firstLoadingStart).format('DD-MM-YYYY') }</TableCell>
                            <TableCell>{ order.isCancelled && 'Annulé' }</TableCell>
                            <TableCell>{ !order.isCancelled && fulfilled(order.id, order.effectiveFirstLoadingStart) }</TableCell>
                            <TableCell>{ !order.isCancelled && bill(order.id, order.invoice) }</TableCell>
                        </TableRow>
                    )}   
                </TableBody> 
            </Table>
        </TableContainer>
        <Paginate 
            currentPage={currentPage}
            length={totalItems}
            onPageChanged={handlePageChange}
        />
    </>    
}
 
export default List;

