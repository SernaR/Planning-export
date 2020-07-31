import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, makeStyles, Paper, TableBody, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import API from '../../services/api'
import { ORDERS_API } from '../../services/config';
import AlertDialog from '../ui/AlertDialog';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(2),
    },
    title: {
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    lastCell: {
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight:0
    },
    button:{
        fontWeight: 'bold',
        color:theme.palette.primary
    }
}))

const List = ({orders, onRemove }) => {
    
    const classes = useStyles()
    const [openAlert, setOpenAlert] = useState(false);
    
    const handleCancel = async() => {
        try {
            await API.update(ORDERS_API, openAlert, { isCancelled:true })
            
        } catch (err) {
            console.log(err.response)
            alert('error')
        }
        onRemove(openAlert)
        setOpenAlert(false)
    }

    const orderCode = order => {
        const disabled =  moment(order.firstLoadingStart) < moment()
        const link = disabled ? order.code : <Link to={ '/creation/' + order.id }>{order.code}</Link>

        return <Button className={classes.button} disabled={disabled} aria-label="modifier">{link}</Button>
    }

    const cancelBtn = order => {
        if(!order.effectiveFirstLoadingStart)
        return <Button 
            aria-label="annuler"
            onClick={() => setOpenAlert(order.id)}>   
            <CloseIcon fontSize='small'/>
        </Button>
    }

    return ( <>
        <TableContainer className={classes.container} component={Paper}>
            <Table size="small" aria-label="table">
                <TableHead>
                    <TableRow >
                        <TableCell className={classes.title}>Ordre N°</TableCell>   
                        <TableCell className={classes.title}>Pays</TableCell>
                        <TableCell className={classes.title}>Entrepôts</TableCell>
                        <TableCell className={classes.title}>Transporteur</TableCell>
                        <TableCell className={classes.title}>Date</TableCell>
                       <TableCell className={classes.title}>Annuler</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map( (order, key) => 
                        <TableRow hover key={key}>
                            <TableCell>{ orderCode(order) }</TableCell>
                            <TableCell>{ order.country.name }</TableCell> 
                            <TableCell>{ order.firstLoadingWarehouse.name }{order.secondLoadingWarehouse && ' + ' +  order.secondLoadingWarehouse.name }</TableCell>
                            <TableCell>{ order.carrier.name }</TableCell>
                            <TableCell>{moment(order.firstLoadingStart).format('DD-MM-YYYY')}</TableCell>
                            <TableCell className={classes.lastCell}>{cancelBtn(order)}</TableCell>
                        </TableRow>
                    )}   
                </TableBody> 
            </Table>
            
        </TableContainer>
        <AlertDialog 
            text="Vous allez annuler l'ordre de transport" 
            open={openAlert} 
            onClose={() =>setOpenAlert(false)} >
            <Button onClick={handleCancel} variant="contained" color="primary">
                Continuer
            </Button>
        </AlertDialog>
        </>
     );
}
 
export default List;