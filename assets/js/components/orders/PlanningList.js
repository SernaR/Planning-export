import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, makeStyles, Paper, TableBody, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import API from '../../services/api'
import moment from 'moment'
import { ORDERS_API } from '../../services/config';
import AlertDialog from '../ui/AlertDialog';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
      margin: '1em auto',
    },
    button: {
        textTransform: 'capitalize'
    },
    title: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
})

const PlanningList = ({orders, onRemove }) => {
    const classes = useStyles()
    const [openAlert, setOpenAlert] = useState(false);
    

    /*const fulfilled = (id, loaded) => {
        let text = 'A confirmer'
        let status = 'contained'
        if(loaded) {
            text = 'Réalisé'
            status = 'outlined'
        }
        return <Link to={ '/ordres/annonce/ordre/' + id }><Button className={classes.button} size="small" variant={status}>{text}</Button></Link>
    }*/

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

    return ( <>
        <TableContainer className={classes.container} component={Paper}>
            <Table size="small" aria-label="table">
                <TableHead>
                    <TableRow >
                        <TableCell className={classes.title}>Ordre de transport</TableCell>
                        <TableCell className={classes.title}>Pays</TableCell>
                        <TableCell className={classes.title}>Transporteur</TableCell>
                        <TableCell className={classes.title}>Date</TableCell>
                        <TableCell className={classes.title}>status</TableCell>
                        <TableCell className={classes.title}>Annuler</TableCell>
                    </TableRow>
                </TableHead>
            
                <TableBody>
                    {orders.map( (order, key) => 
                        <TableRow hover role="checkbox" key={key}>
                            <TableCell>{ order.code }</TableCell>
                            <TableCell>{ order.firstDeliveryWarehouse ? order.country.name : ''}</TableCell> 
                            <TableCell>{ order.carrier ? order.carrier.name : ''}</TableCell>
                            <TableCell>{ moment(order.firstLoadingStart).format('DD/MM/YYYY à HH:mm') }</TableCell>
                            <TableCell>
                                <Link to={ '/creation/' + order.id }>
                                    <IconButton 
                                        aria-label="modifier">
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <IconButton 
                                    aria-label="annuler"
                                    onClick={() => setOpenAlert(order.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
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
 
export default PlanningList;