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
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
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
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
  })

const List = ({url}) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0);
    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect( () => {
        setLoading(true);
        const and = url.includes('?') ? '&' : '?'

        axios.get(url + and + 'order[firstLoadingStart]=desc&page=' + currentPage)
            .then( response => {
                setOrders(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    },  [currentPage, url] );

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
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
    
            <TableContainer className={classes.container} component={Paper}>
                <Table size="small" aria-label="table">
                    <TableHead>
                        <TableRow >
                            <TableCell className={classes.title}>Ordre de transport</TableCell>
                            <TableCell className={classes.title}>Pays</TableCell>
                            <TableCell className={classes.title}>Transporteur</TableCell>
                            <TableCell className={classes.title}>Date</TableCell>
                            <TableCell className={classes.title}>status</TableCell>
                            <TableCell className={classes.title}>Facturation</TableCell>
                        </TableRow>
                    </TableHead>
                
                    <TableBody>
                        {orders.map( (order, key) => 
                            <TableRow hover role="checkbox" key={key}>
                                <TableCell>{ order.code }</TableCell>
                                <TableCell>{ order.firstDeliveryWarehouse ? order.firstDeliveryWarehouse.adress.country.name : ''}</TableCell> 
                                <TableCell>{ order.carrier ? order.carrier.name : ''}</TableCell>
                                <TableCell>{ moment(order.firstLoadingStart).format('DD-MM-YYYY HH:mm') }</TableCell>
                                <TableCell>{ fulfilled(order.id, order.effectiveFirstLoadingStart) }</TableCell>
                                <TableCell>{ bill(order.id, order.invoice) }</TableCell>
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

/*
table className="table hover">
    <tbody>
        {orders.map( (order, key) => <tr key={key} >
            <td>{ order.code }</td>
            <td>{ order.firstDeliveryWarehouse ? order.firstDeliveryWarehouse.adress.country.name : ''}</td> 
            <td>{ order.carrier ? order.carrier.name : ''}</td>
            <td>{ order.firstLoadingStart }</td>
            <td>{fulfilled(order.id, order.effectiveFirstLoadingStart)}</td>
            <td>{bill(order.id, order.invoice)}</td>
        </tr>)} 
    </tbody>
</table>
*/