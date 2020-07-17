import React, { useEffect, useState, useRef } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'

import Picker from '../components/form/DateTimePicker'
import Field from '../components/form/Field'
import {toast} from '../services/toast'
import { Container, Grid, Card, CardContent, Typography, makeStyles, Button, Divider } from '@material-ui/core';

import moment from 'moment'
import PageWrap from '../components/ui/PageWrap';


const useStyles = makeStyles((theme) => ({
    card: {
      margin: '1em auto',
      paddingLeft:theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    label:{
         fontWeight: 'bold',
         display: 'flex',
         alignItems: 'center'
    },
    span: {
        fontWeight: 'normal',
        paddingLeft: theme.spacing(2)
    },
    title: {
        paddingBottom: theme.spacing(4),
        textAlign: 'center',
        fontSize: '2em'
    }
}))

const Fulfill = ({ match, history }) => {
    const classes = useStyles();
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
            const {
                country, vehicle,
                amount, weight, volume,
                effectiveFirstLoadingBoxes, effectiveFirstLoadingPallets, effectiveFirstLoadingPieces,
                firstLoadingStart, effectiveFirstLoadingStart, 
                firstLoadingEnd, effectiveFirstLoadingEnd, 
                firstDelivery, effectiveFirstDelivery, 
                code, carrier, firstLoadingWarehouse, firstDeliveryWarehouse
            } = await API.find(ORDERS_API, match.params.id) 
            setOrder({ code, carrier, firstLoadingWarehouse, firstDeliveryWarehouse, country, vehicle })
            checkDate({
                amount: amount || '',
                weight: weight || '', 
                volume: volume|| '',
                effectiveFirstLoadingBoxes: effectiveFirstLoadingBoxes || '', 
                effectiveFirstLoadingPallets: effectiveFirstLoadingPallets || '', 
                effectiveFirstLoadingPieces: effectiveFirstLoadingPieces || '',
                effectiveFirstLoadingStart: moment(effectiveFirstLoadingStart ? effectiveFirstLoadingStart : firstLoadingStart),
                effectiveFirstLoadingEnd: moment(effectiveFirstLoadingEnd ? effectiveFirstLoadingEnd :firstLoadingEnd),
                effectiveFirstDelivery: moment(effectiveFirstDelivery ? effectiveFirstDelivery :firstDelivery)
            }) 
        } catch(err){
            console.log(err.response)
        }
        setLoading(false)
        console.log()
    }

    const handleChangeDate = (name, date) => {
        checkDate({ ...fulfill, [name]: date })
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget
        setFulfill({ ...fulfill, [name]: value })
    }

    const checkDate = (fulfill) => {
        if (fulfill.effectiveFirstLoadingStart && fulfill.effectiveFirstLoadingEnd && fulfill.effectiveFirstDelivery) {
            disabled.current = (fulfill.effectiveFirstDelivery>fulfill.effectiveFirstLoadingEnd && fulfill.effectiveFirstLoadingEnd>fulfill.effectiveFirstLoadingStart)? false : true
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

        return isNaN(amount + weight + volume + effectiveFirstLoadingBoxes + effectiveFirstLoadingPallets + effectiveFirstLoadingPieces) ?
            false : ({ ...fulfill, amount, weight, volume, effectiveFirstLoadingBoxes, effectiveFirstLoadingPallets, effectiveFirstLoadingPieces})
        
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        setLoading(true)
        
        try{
            const fulfill = formater()
            const {data, status} = await API.update(ORDERS_API, match.params.id, fulfill)
            if(status === 200) {
                //toast.change('Enregistrement éffectué') 
                history.push('/liste') //filtre ?************************
            }
        } catch (error) { 
            submitted.current = true
            toast.change('Des erreurs dans le formulaire') 
            toast.show() 
        }
         
        setLoading(false)
    }

    const NumberValidation = number => {
        return ( submitted.current && (!number || (isNaN(number)) )) 
    }

    return  <PageWrap
        loading={loading}
        title={`Mise à jour : ${order.code || ''}`}
    > 
        <Container fixed>
            <form >
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
                                <Typography gutterBottom className={classes.label}>Entrepôt : <span className={classes.span}>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</span></Typography>
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
                                <Typography gutterBottom className={classes.label} >Entrepôt : <span className={classes.span}>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</span></Typography>
                                <Picker 
                                    label="Date d'arrivée" 
                                    onChange={handleChangeDate} 
                                    name="effectiveFirstDelivery" 
                                    value={fulfill.effectiveFirstDelivery}
                                    minDate={fulfill.effectiveFirstLoadingEnd}/>   
                                <Field name='amount' label='Tarif' value={fulfill.amount} onChange={ handleChange } error={NumberValidation(fulfill.amount)}/>
                            </CardContent>
                        </Card> 
                    </Grid>   
                </Grid>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container justify="space-around">
                            <Grid item xs={12}><Typography className={classes.title}>Quantité réalisée</Typography></Grid>
                            <Divider />
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
                <Button onClick={ handleSubmit } variant="contained" color="primary" disabled={disabled.current}>Enregistrer</Button>
            </form>
        </Container>
        <div><pre>{JSON.stringify(fulfill, null, 4)}</pre></div>   
    </PageWrap>  
}
 
export default Fulfill;

