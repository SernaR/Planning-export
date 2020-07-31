import React, { useEffect, useState, useRef } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'

import Picker from '../components/form/DateTimePicker'
import Field from '../components/form/Field'
import { Container, Grid, Card, CardContent, Typography, makeStyles, Button, CardActions } from '@material-ui/core';

import moment from 'moment'
import PageWrap from '../components/ui/PageWrap';


const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(2), 
        //marginBottom: theme.spacing(2), 
        paddingLeft:theme.spacing(2),
        paddingRight: theme.spacing(2),
        minHeight: '100%'
    },
    card2: {
        marginTop: theme.spacing(3),
        paddingLeft:theme.spacing(2),
        paddingRight: theme.spacing(2),
        minHeight: '100%',
        position: 'relative'
    },
    label:{
        fontWeight: 'bold',  
    },
    label2:{
        fontWeight: 'bold',
        marginTop: theme.spacing(1),
   },
    span: {
        fontWeight: 'normal',
        paddingLeft: theme.spacing(2)
    },
    title: {
        paddingBottom: theme.spacing(4),
        textAlign: 'center',
        fontSize: '2em'
    },
    cardActions: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(4), 
    }
}))

const Fulfill = ({ match, history }) => {
    const classes = useStyles();
    const message = useRef('')

    const [toast, setToast] = useState(false) 
    const [order, setOrder] = useState({})
    const [fulfill, setFulfill] = useState({})

    const [loading, setLoading] = useState(false)

    const submitted = useRef(false)
    const disabled = useRef(true)

    useEffect( () => {
        fetchOrder()
    }, [])

    const fetchOrder = async() => {
        setLoading(true)
        try{
            const orderFound = await API.find(ORDERS_API, match.params.id)
            const fulfill = {
                amount: orderFound.amount || '',
                weight: orderFound.weight || '', 
                volume: orderFound.volume|| '',
                effectiveFirstLoadingBoxes: orderFound.effectiveFirstLoadingBoxes || '', 
                effectiveFirstLoadingPallets: orderFound.effectiveFirstLoadingPallets || '', 
                effectiveFirstLoadingPieces: orderFound.effectiveFirstLoadingPieces || '',
                effectiveFirstLoadingStart: moment(orderFound.effectiveFirstLoadingStart ? orderFound.effectiveFirstLoadingStart : orderFound.firstLoadingStart),
                effectiveFirstLoadingEnd: moment(orderFound.effectiveFirstLoadingEnd ? orderFound.effectiveFirstLoadingEnd :orderFound.firstLoadingEnd),
                effectiveFirstDelivery: moment(orderFound.effectiveFirstDelivery ? orderFound.effectiveFirstDelivery :orderFound.firstDelivery)
            }
            const order = { 
                code: orderFound.code, 
                carrier: orderFound.carrier, 
                firstLoadingWarehouse: orderFound.firstLoadingWarehouse, 
                firstDeliveryWarehouse: orderFound.firstDeliveryWarehouse, 
                country: orderFound.country, 
                vehicle : orderFound.vehicle
            }
            if(orderFound.secondLoadingWarehouse) {
                order.secondLoadingWarehouse = orderFound.secondLoadingWarehouse
                fulfill.effectiveSecondLoadingStart = moment(orderFound.effectiveSecondLoadingStart ? orderFound.effectiveSecondLoadingStart : orderFound.secondLoadingStart)
                fulfill.effectiveSecondLoadingEnd = moment(orderFound.effectiveSecondLoadingEnd ? orderFound.effectiveSecondLoadingEnd :orderFound.secondLoadingEnd)
            }
            if(orderFound.secondDeliveryWarehouse){
                order.secondDeliveryWarehouse = orderFound.secondDeliveryWarehouse
                fulfill.effectiveSecondDelivery = moment(orderFound.effectiveSecondDelivery ? orderFound.effectiveSecondDelivery :orderFound.secondDelivery)
            }
            setOrder(order)
            checkDate(fulfill) 
        } catch(err){
            setToast(true)
        }
        setLoading(false)
    }

    const handleChangeDate = (name, date) => {
        checkDate({ ...fulfill, [name]: date })
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget
        setFulfill({ ...fulfill, [name]: value })
    }

    const checkDate = (fulfill) => {
        //2 loading - 2 delivery
        if(fulfill.effectiveSecondLoadingStart && fulfill.effectiveSecondLoadingEnd && fulfill.effectiveSecondDelivery && fulfill.effectiveFfulfillirstLoadingStart && fulfill.effectiveFfulfillirstLoadingEnd && fulfill.effectiveFfulfillirstDelivery){
            disabled.current = (
                fulfill.effectiveSecondDelivery>fulfill.effectiveFirstDelivery &&
                fulfill.effectiveFirstDelivery>fulfill.effectiveSecondLoadingEnd && 
                fulfilleffectiveSecondLoadingEnd>fulfill.effectiveSecondLoadingStart &&
                fulfill.effectiveSecondLoadingStart>fulfill.effectiveFirstLoadingEnd &&
                fulfill.effectiveFirstLoadingEnd>fulfill.effectiveFirstLoadingStart
            )? false : true
        }
        //1 loading - 2 delivery
        else if(fulfill.effectiveSecondDelivery && fulfill.effectiveFirstLoadingStart && fulfill.effectiveFirstLoadingEnd && fulfill.effectiveFirstDelivery){
            disabled.current = (
                fulfill.effectiveSecondDelivery>fulfill.effectiveFirstDelivery &&
                fulfill.effectiveFirstDelivery>fulfill.effectiveFirstLoadingEnd && 
                fulfill.effectiveFirstLoadingEnd>fulfill.effectiveFirstLoadingStart
            )? false : true
        }
        //2 loading - 1 delivery
        else if(fulfill.effectiveSecondLoadingStart && fulfill.effectiveSecondLoadingEnd && fulfill.effectiveFirstLoadingStart && fulfill.effectiveFirstLoadingEnd && fulfill.effectiveFirstDelivery){
            disabled.current = (
                fulfill.effectiveFirstDelivery>fulfill.effectiveSecondLoadingEnd && 
                fulfill.effectiveSecondLoadingEnd>fulfill.effectiveSecondLoadingStart &&
                fulfill.effectiveSecondLoadingStart>fulfill.effectiveFirstLoadingEnd &&
                fulfill.effectiveFirstLoadingEnd>fulfill.effectiveFirstLoadingStart
            )? false : true
        }
        //1 loading - 1 delivery
        else if (fulfill.effectiveFirstLoadingStart && fulfill.effectiveFirstLoadingEnd && fulfill.effectiveFirstDelivery) {
            disabled.current = (
                fulfill.effectiveFirstDelivery>fulfill.effectiveFirstLoadingEnd && 
                fulfill.effectiveFirstLoadingEnd>fulfill.effectiveFirstLoadingStart
            )? false : true
        }    
        setFulfill(fulfill) 
    }

    const formater = () => {
        const amount = parseFloat(fulfill.amount) || 0
        const effectiveFirstLoadingBoxes = parseInt(fulfill.effectiveFirstLoadingBoxes) || 0
        const effectiveFirstLoadingPallets = parseInt(fulfill.effectiveFirstLoadingPallets) || 0
        const effectiveFirstLoadingPieces = parseInt(fulfill.effectiveFirstLoadingPieces)|| 0
        const weight = parseInt(fulfill.weight) || 0
        const volume = parseFloat(fulfill.volume) || 0
        const checkAll = amount + weight + volume + effectiveFirstLoadingBoxes + effectiveFirstLoadingPallets + effectiveFirstLoadingPieces
        const checkQty = weight + volume + effectiveFirstLoadingBoxes + effectiveFirstLoadingPallets + effectiveFirstLoadingPieces

        return (isNaN(checkAll) || checkQty === 0) ?
            false : ({ ...fulfill, amount, weight, volume, effectiveFirstLoadingBoxes, effectiveFirstLoadingPallets, effectiveFirstLoadingPieces})
        
    }

    const goBack = () =>  history.push('/liste') //filtre ?************************

    const handleSubmit = async(e) => {
        e.preventDefault()

        setLoading(true)
        
        try{
            const fulfill = formater()
            const {data, status} = await API.update(ORDERS_API, match.params.id, fulfill)
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

    const NumberValidation = number => {
        return ( submitted.current && (!number || (isNaN(number)) )) 
    }

    return  <PageWrap
        loading={loading}
        title={`Mise à jour : ${order.code || ''}`}
        message={message.current}
        open={toast}
        onClose={() => {
            message.current = ''
            setToast(false)}}
    > 
        <Container fixed>
            <form >
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container justify="center">
                            <Grid item xs={12}><Typography className={classes.title}>Quantité réalisée</Typography></Grid>
                            <Grid item xs={2}>
                                <Field name='effectiveFirstLoadingBoxes' label='Colis' value={fulfill.effectiveFirstLoadingBoxes} onChange={ handleChange } variant='outlined' error={NumberValidation(fulfill.effectiveFirstLoadingBoxes)}/>
                            </Grid>
                            <Grid item xs={2}>
                                <Field name='effectiveFirstLoadingPallets' label='Palettes' value={fulfill.effectiveFirstLoadingPallets} onChange={ handleChange } variant='outlined' error={NumberValidation(fulfill.effectiveFirstLoadingPallets)}/>
                            </Grid>
                            <Grid item xs={2}>  
                                <Field name='effectiveFirstLoadingPieces' label='Pièces' value={fulfill.effectiveFirstLoadingPieces} onChange={ handleChange } variant='outlined' error={NumberValidation(fulfill.effectiveFirstLoadingPieces)}/>                                   
                            </Grid>
                            <Grid item xs={2}>  
                                <Field name='weight' label='Poids' value={fulfill.weight} onChange={ handleChange } variant='outlined' unit='Kg' error={NumberValidation(fulfill.weight)}/>                                  
                            </Grid>
                            <Grid item xs={2}>  
                                <Field name='volume' label='Volume' value={fulfill.volume} onChange={ handleChange } variant='outlined' unit='m³' error={NumberValidation(fulfill.volume)}/>                                    
                            </Grid>
                        </Grid>  
                    </CardContent>
                </Card>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography className={classes.title}>Général</Typography> 
                                <Typography  className={classes.label}>Pays : <span className={classes.span}>{order.country && order.country.name}</span></Typography>
                                <Typography className={classes.label}>Transporteur : <span className={classes.span}>{order.carrier && order.carrier.name}</span></Typography>
                                <Typography className={classes.label}>Véhicule : <span className={classes.span}>{order.vehicle && order.vehicle.name}</span>  </Typography>    
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.title}>Départ</Typography>
                                <Typography gutterBottom className={classes.label}>Premier entrepôt : <span className={classes.span}>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</span></Typography>
                                <Picker 
                                    label="Date de départ - début" 
                                    onChange={handleChangeDate} 
                                    name="effectiveFirstLoadingStart" 
                                    value={fulfill.effectiveFirstLoadingStart}/>
                                <Picker 
                                    label="Date de départ - fin" 
                                    onChange={handleChangeDate} 
                                    name="effectiveFirstLoadingEnd" 
                                    value={fulfill.effectiveFirstLoadingEnd}
                                    minDate={fulfill.effectiveFirstLoadingStart}/>
                            </CardContent>
                        </Card> 
                    </Grid>
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography className={classes.title}>Arrivée</Typography>
                                <Typography gutterBottom className={classes.label} >Premier entrepôt : <span className={classes.span}>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</span></Typography>
                                <Picker 
                                    label="Date d'arrivée" 
                                    onChange={handleChangeDate} 
                                    name="effectiveFirstDelivery" 
                                    value={fulfill.effectiveFirstDelivery}
                                    minDate={fulfill.effectiveSecondLoadingEnd || fulfill.effectiveFirstLoadingEnd}
                                    />   
                                
                            </CardContent>
                        </Card> 
                    </Grid>   
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className={classes.card2}>
                            <CardContent> 
                                <Field 
                                    name='amount' 
                                    label='Tarif' 
                                    value={fulfill.amount} 
                                    onChange={ handleChange } 
                                    error={NumberValidation(fulfill.amount)}/>   
                            </CardContent>
                            <CardActions className={classes.cardActions}>
                                <Button 
                                    onClick={goBack} 
                                    color="primary">
                                    Retour
                                </Button> 
                                <Button 
                                    onClick={ handleSubmit } 
                                    variant="contained" color="primary" 
                                    disabled={disabled.current}
                                    fullWidth
                                >Enregistrer</Button>   
                            </CardActions>       
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card2}>
                            <CardContent>
                                <Typography gutterBottom className={classes.label2}>Second entrepôt : <span className={classes.span}>{order.secondLoadingWarehouse && order.secondLoadingWarehouse.name}</span></Typography>
                                <Picker 
                                    label="Date de départ - début" 
                                    onChange={handleChangeDate} 
                                    name="effectiveSecondLoadingStart" 
                                    disabled={order.secondLoadingWarehouse ? false : true}
                                    value={fulfill.effectiveSecondLoadingStart}
                                    minDate={fulfill.effectiveFirstLoadingEnd}
                                    />
                                <Picker 
                                    label="Date de départ - fin" 
                                    onChange={handleChangeDate} 
                                    name="effectiveSecondLoadingEnd" 
                                    disabled={order.secondLoadingWarehouse? false : true}
                                    value={fulfill.effectiveSecondLoadingEnd}
                                    minDate={fulfill.effectiveSecondLoadingStart}
                                    />
                            </CardContent>
                        </Card> 
                    </Grid>
                    <Grid item xs={4}>
                        <Card className={classes.card2}>
                            <CardContent >
                                <Typography gutterBottom className={classes.label2} >Second entrepôt : <span className={classes.span}>{order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.name}</span></Typography>
                                <Picker 
                                    label="Date d'arrivée" 
                                    onChange={handleChangeDate} 
                                    name="effectiveSecondDelivery"
                                    disabled={order.secondDeliveryWarehouse ? false : true} 
                                    value={fulfill.effectiveSecondDelivery}
                                    minDate={fulfill.effectiveFirstDelivery}
                                    /> 
                            </CardContent>
                        </Card> 
                    </Grid>   
                </Grid>
            </form>
        </Container>
    </PageWrap>  
}
 
export default Fulfill;

