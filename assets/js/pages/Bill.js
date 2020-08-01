import React, { useEffect, useRef, useState } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'

import moment from 'moment'

import { Container, Grid, Card, CardContent, Typography, Button, CardActions } from '@material-ui/core';
import { useStyles } from '../styles/orderForm'

import Field from '../components/form/Field'
import PageWrap from '../components/ui/PageWrap';

const Bill = ({ match, history }) => {
    const classes = useStyles()
    const message = useRef('')

    const [toast, setToast] = useState(false) 
    const [bill, setBill] = useState({})
    const [order, setOrder] = useState({})
    const [loading, setLoading] = useState(false)
    const submitted = useRef(false)

    useEffect( () => {
        fetchOrder()
    }, [])

    const fetchOrder = async()  => {
        setLoading(true)
        try{
            const order = await API.find(ORDERS_API, match.params.id)
            setOrder( order )
            setBill({  
                amount: order.amount, 
                invoice:order.invoice || '',
                comment: order.comment || ''
            })
        } catch(err){
            setToast(true)
        }
        setLoading(false)    
    }

    const validation = valid => {
        return ( submitted.current && (!valid || valid === '0' ))
    }

    const NumberValidation = number => {
        return ( submitted.current && (!number || (isNaN(number)) )) 
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget
        setBill({ ...bill, [name]: value })
    }

    const formater = () => {
        const amount = parseFloat(bill.amount)
        return ( isNaN(amount) || bill.invoice === '' )  ? false :({ ...bill, amount}) 
    }

    const goBack = () =>  history.push('/liste') //filtre ?

    const handleSubmit = async(e) => {  
        e.preventDefault()
        setLoading(true)
        
        try{
            const bill = formater()
            const { status } = await API.update(ORDERS_API, match.params.id, bill)
            if(status === 200) {
                goBack()
            }
        } catch (error) {  
            submitted.current = true
            message.current = "Il y a des erreurs dans le formulaire"
            setToast(true) 
        } 
        setLoading(false)
    }  
    
    return <PageWrap
        loading={loading}
        title={`Facturation : ${order.code || ''}`}
        message={message.current}
        open={toast}
        onClose={() => {
            message.current = ''
            setToast(false)}}
    > 
        <Container fixed>
            <form>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container justify="center">
                            <Grid item xs={12}>
                                <Typography className={classes.title}>Facturation - Commentaires</Typography>
                            </Grid> 
                            <Grid item xs={4}> 
                                <Field 
                                    name='invoice'  
                                    label='Facture'
                                    variant="outlined" 
                                    value={bill.invoice} 
                                    onChange={ handleChange } 
                                    error={validation(bill.invoice)}/>
                            </Grid>  
                            <Grid item xs={8}>    
                                <Field 
                                    name='comment' 
                                    variant="outlined" 
                                    label='Commentaire' 
                                    value={bill.comment} 
                                    onChange={ handleChange } 
                                    mult iline/>
                            </Grid>                              
                        </Grid>
                    </CardContent>
                </Card>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography className={classes.title}>Général</Typography> 
                                <Typography className={classes.label}>Pays : <span className={classes.span}>{order.country && order.country.name}</span></Typography>
                                <Typography className={classes.label}>Transporteur : <span className={classes.span}>{order.carrier && order.carrier.name}</span></Typography>
                                <Typography className={classes.label}>Véhicule : <span className={classes.span}>{order.vehicle && order.vehicle.name}</span>  </Typography>    
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography className={classes.title}>Départ</Typography>
                                <Typography className={classes.label}>Premier entrepôt : <span className={classes.span}>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</span></Typography>
                                <Typography className={classes.label}>Date de début : <span className={classes.span}>{moment(order.effectiveFirstLoadingStart).format('DD/MM/YYYY à HH:mm')}</span></Typography>
                                <Typography className={classes.label}>Date de fin : <span className={classes.span}>{moment(order.effectiveFirstLoadingEnd).format('DD/MM/YYYY à HH:mm')}</span></Typography>                             
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography className={classes.title}>Arrivée</Typography>
                                <Typography className={classes.label}>Premier entrepôt : <span className={classes.span}>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</span></Typography>
                                <Typography className={classes.label}>Date de début : <span className={classes.span}>{moment(order.effectiveFirstDelivery).format('DD/MM/YYYY à HH:mm')}</span></Typography>                               
                            </CardContent>
                        </Card>
                    </Grid> 
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className={classes.card2}>
                            <CardContent >
                                <Field 
                                    name='amount' 
                                    label='Tarif' 
                                    value={bill.amount} 
                                    onChange={ handleChange } 
                                    error={NumberValidation(bill.amount)}/>  
                            </CardContent>
                            <CardActions className={classes.cardActions}>
                                <Button 
                                    onClick={goBack} 
                                    color="primary">
                                    Retour
                                </Button>                                   
                                <Button 
                                    onClick={ handleSubmit } 
                                    variant="contained" 
                                    color="primary"
                                    >Enregistrer
                                </Button>
                            </CardActions>    
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card2}>
                            <CardContent >                
                                <Typography className={classes.label2}>Second entrepôt : <span className={classes.span}>{order.secondLoadingWarehouse && order.secondLoadingWarehouse.name}</span></Typography>
                                <Typography className={classes.label}>Date de début : <span className={classes.span}>{order.effectiveSecondLoadingStart && moment(order.effectiveSecondLoadingStart).format('DD/MM/YYYY à HH:mm')}</span></Typography>
                                <Typography className={classes.label}>Date de fin : <span className={classes.span}>{order.effectiveSecondLoadingEnd && moment(order.effectiveSecondLoadingEnd).format('DD/MM/YYYY à HH:mm')}</span></Typography>                             
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card2}>
                            <CardContent >
                                <Typography className={classes.label2}>Second entrepôt : <span className={classes.span}>{order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.name}</span></Typography>
                                <Typography className={classes.label}>Date de début : <span className={classes.span}>{order.effectiveSecondDelivery && moment(order.effectiveSecondDelivery).format('DD/MM/YYYY à HH:mm')}</span></Typography>                               
                            </CardContent>
                        </Card>
                    </Grid> 
                </Grid>  
            </form>   
        </Container>
    </PageWrap> 
}
 
export default Bill;