import React, { useEffect, useState, useRef } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'

import Picker from '../components/form/DateTimePicker'
import Field from '../components/form/Field'
import {toast} from '../services/toast'
import ProgressBar from '../components/ui/ProgressBar';
import Hero from '../components/ui/Hero';
import { Container, Grid, Card, CardContent, Typography, makeStyles, TableContainer, Paper, Table, TableRow, TableCell, TableBody, Button, Fab } from '@material-ui/core';

import moment from 'moment'

const useStyles = makeStyles((theme) => ({
    card: {
      margin: '1em auto',
      paddingBottom: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(2)
    }
}))

const Fulfill = ({ match, history }) => {
    const classes = useStyles();
    const [order, setOrder] = useState({})
    const [fulfill, setFulfill] = useState({})

    const [loading, setLoading] = useState(false)
    const submitted = useRef(false)

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
            setFulfill({
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
        setFulfill({ ...fulfill, [name]: date })
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget
        setFulfill({ ...fulfill, [name]: value })
    }

    const formater = () => {
        const amount = parseFloat(fulfill.amount)
        const effectiveFirstLoadingBoxes = parseInt(fulfill.effectiveFirstLoadingBoxes)
        const effectiveFirstLoadingPallets = parseInt(fulfill.effectiveFirstLoadingPallets) 
        const effectiveFirstLoadingPieces = parseInt(fulfill.effectiveFirstLoadingPieces)
        const weight = parseInt(fulfill.weight) 
        const volume = parseInt(fulfill.volume)

        if(isNaN(amount + weight + volume + effectiveFirstLoadingBoxes + effectiveFirstLoadingPallets + effectiveFirstLoadingPieces)){
            return false
        } else {
            return ({ ...fulfill, amount, weight, volume, effectiveFirstLoadingBoxes, effectiveFirstLoadingPallets, effectiveFirstLoadingPieces})
        }   
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        setLoading(true)
        submitted.current = true
        //test validité date 3>2>1
        if(!(fulfill.effectiveFirstDelivery>fulfill.effectiveFirstLoadingEnd && fulfill.effectiveFirstLoadingEnd>fulfill.effectiveFirstLoadingStart)){
            toast.change('Des erreurs dans les dates')
        }else {
            try{
                const fulfill = formater()
                const {data, status} = await API.update(ORDERS_API, match.params.id, fulfill)
                if(status === 200) {
                    toast.change('Enregistrement éffectué') 
                    history.push('/liste') //filtre ?************************
                }
            } catch (error) {    
                toast.change('Des erreurs dans le formulaire') 
            }
        }
        
        toast.show()   
        setLoading(false)
    }

    const NumberValidation = number => {
        return ( submitted.current && (!number || (isNaN(number)) )) 
    }

    if (!order) return <div className="progress indeterminate">
        <div className="progress-bar secondary dark-1"></div>
    </div>

    return  <>
        { loading && <ProgressBar /> || <div style={{height: '4px' }}></div>}
        <Hero title={order.code}/>
        <Container fixed>
            <form >
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography variant='h3'>Géneral</Typography>
                                <Typography variant='body1'>{order.country && order.country.name}</Typography>
                                <Typography variant='body1'>{order.carrier && order.carrier.name}</Typography>
                                <Typography variant='body1'>{order.vehicle && order.vehicle.name}</Typography>                                
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant='h3'>Départ</Typography>
                                <Typography variant='body1'>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</Typography>
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
                            <Typography variant='h3'>Arrivé</Typography>
                            <Typography variant='body1'>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</Typography>
                                <Picker 
                                    label="Date d'arrivé" 
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
                            <Grid item xs={12}><Typography variant='h3'>Quantité réalisé</Typography></Grid>
                            <Grid xs={2}>
                                <Field name='effectiveFirstLoadingBoxes' label='Colis' value={fulfill.effectiveFirstLoadingBoxes} onChange={ handleChange } variant='outlined' error={NumberValidation(fulfill.effectiveFirstLoadingBoxes)}/>
                            </Grid>
                            <Grid xs={2}>
                                <Field name='effectiveFirstLoadingPallets' label='Palettes' value={fulfill.effectiveFirstLoadingPallets} onChange={ handleChange } variant='outlined' error={NumberValidation(fulfill.effectiveFirstLoadingPallets)}/>
                            </Grid>
                            <Grid xs={2}>  
                                <Field name='effectiveFirstLoadingPieces' label='Pièces' value={fulfill.effectiveFirstLoadingPieces} onChange={ handleChange } variant='outlined' error={NumberValidation(fulfill.effectiveFirstLoadingPieces)}/>                                   
                            </Grid>
                            <Grid xs={2}>  
                                <Field name='weight' label='Poids' value={fulfill.weight} onChange={ handleChange } variant='outlined' unit='Kg' error={NumberValidation(fulfill.weight)}/>                                  
                            </Grid>
                            <Grid xs={2}>  
                                <Field name='volume' label='Volume' value={fulfill.volume} onChange={ handleChange } variant='outlined' unit='m³' error={NumberValidation(fulfill.volume)}/>                                    
                            </Grid>
                        </Grid>  
                    </CardContent>
                </Card>
                
                <Button className={classes.button} onClick={ handleSubmit } variant="contained" color="primary">Enregistrer</Button>
            </form>
        </Container>
        <div><pre>{JSON.stringify(fulfill, null, 4)}</pre></div>   
    </> 
}
 
export default Fulfill;

//NumberValidation(fulfill.volume) --> error
