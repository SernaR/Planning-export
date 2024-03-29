import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CREATE_SETUP_API, ORDERS_API }  from '../services/config'
import API from '../services/api'
import moment from 'moment'

import Field from '../components/form/Field';
import Select from '../components/form/Selection';
import Picker from '../components/form/DateTimePicker';

import rateAPI from '../services/rateAPI'
import useSWR from 'swr';

import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../components/PdfDocument";

import { Container, Grid, Card, CardContent, Typography, Button, CardActions } from '@material-ui/core';
import { useStyles } from '../styles/orderForm'

import LoadingPage from '../components/ui/LoadingPage';
import AlertDialog from '../components/ui/AlertDialog';
import PageWrap from '../components/ui/PageWrap';

const Create = ({match, history}) => {
    const classes = useStyles();
    const { id } = match.params;

    const { data: initials, error } = useSWR( CREATE_SETUP_API, API.fetcher )
    
    const countries = useRef([])
    if (initials) {
        countries.current = initials.destinations.map(init => init.country)
    }
 
    const [destination, setDestination] = useState({})
    const [order, setOrder] = useState({})
    const [pdf, setPdf] = useState({})
    
    const submitted = useRef(false)
    const disabled = useRef(true)
    const message = useRef('')

    const [toast, setToast] = useState(false) 
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);

    const setup = () => {
        setOrder({})
        setDestination({})

        submitted.current = false
        disabled.current = true
    }

    const fetchData = async(id) => {
        try {
            const orderFound = await API.find(ORDERS_API, id)
            
            const order = {  
                code: orderFound.code,
                carrier: orderFound.carrier['@id'],
                vehicle: orderFound.vehicle['@id'],
                firstLoadingWarehouse: orderFound.firstLoadingWarehouse['@id'],
                firstLoadingStart: orderFound.firstLoadingStart,
                firstLoadingEnd: orderFound.firstLoadingEnd,
                firstDeliveryWarehouse: orderFound.firstDeliveryWarehouse['@id'],
                firstDelivery: orderFound.firstDelivery,  
                amount: orderFound.amount || ''
            }
            if(orderFound.secondLoadingWarehouse) {
                order.secondLoadingWarehouse= orderFound.secondLoadingWarehouse['@id']
                order.secondLoadingStart= orderFound.secondLoadingStart
                order.secondLoadingEnd= orderFound.secondLoadingEnd
            }
            if(orderFound.secondDeliveryWarehouse){
                order.secondDeliveryWarehouse = orderFound.secondDeliveryWarehouse['@id']
                order.secondDelivery = orderFound.secondDelivery
            }
            setDestination(getDestination(orderFound.country.id))
            checkDate(order)
        }catch(err) {
            setToast(true)
        }
    }

    useEffect(() => {
        if(initials) {
            if(id === "nouveau") {
                setup()
            }else {
                setEditing(true)
                fetchData(id)
            } 
        }
    }, [initials, id])
    
    const getRate = (order) => { 
        if (order.carrier && order.firstLoadingWarehouse && order.firstDeliveryWarehouse) {
            setLoading(true)
            rateAPI.find(order)
                .then( amount=> {
                    setOrder({ ...order, amount })   
                }) 
                .catch(error => {
                    setOrder(order)   
                    message.current = 'pas de tarif sur ce schema'
                    setToast(true)
                }) 
        } else {
            setOrder(order)
        }
        setLoading(false)
    }

    const checkDate = (order) => {
        if(moment()>moment(order.firstLoadingStart)){
            disabled.current = true
        }
        //2 loading - 2 delivery
        else if(order.secondLoadingStart && order.secondLoadingEnd && order.secondDelivery && order.firstLoadingStart && order.firstLoadingEnd && order.firstDelivery){
            disabled.current = (
                moment(order.secondDelivery)>moment(order.firstDelivery) &&
                moment(order.firstDelivery)>moment(order.secondLoadingEnd) && 
                moment(order.secondLoadingEnd)>moment(order.secondLoadingStart) &&
                moment(order.secondLoadingStart)>moment(order.firstLoadingEnd) &&
                moment(order.firstLoadingEnd)>moment(order.firstLoadingStart)
            )? false : true
        }
        //1 loading - 2 delivery
        else if(order.secondDelivery && order.firstLoadingStart && order.firstLoadingEnd && order.firstDelivery){
            disabled.current = (
                moment(order.secondDelivery)>moment(order.firstDelivery) &&
                moment(order.firstDelivery)>moment(order.firstLoadingEnd) && 
                moment(order.firstLoadingEnd)>moment(order.firstLoadingStart)
            )? false : true
        }
        //2 loading - 1 delivery
        else if(order.secondLoadingStart && order.secondLoadingEnd && order.firstLoadingStart && order.firstLoadingEnd && order.firstDelivery){
            disabled.current = (
                moment(order.firstDelivery)>moment(order.secondLoadingEnd) && 
                moment(order.secondLoadingEnd)>moment(order.secondLoadingStart) &&
                moment(order.secondLoadingStart)>moment(order.firstLoadingEnd) &&
                moment(order.firstLoadingEnd)>moment(order.firstLoadingStart)
            )? false : true
        }
        //1 loading - 1 delivery
        else if(order.firstLoadingStart && order.firstLoadingEnd && order.firstDelivery) {
            disabled.current = (
                moment(order.firstDelivery)>moment(order.firstLoadingEnd) && 
                moment(order.firstLoadingEnd)>moment(order.firstLoadingStart)
            )? false : true
        }

        setOrder(order) 
    }

    const handleChangeCountry = ({value}) => {  
        setOrder({ ...order,
            firstDeliveryWarehouse: '',
            carrier: '',
            firstLoadingWarehouse: '',                      
            amount: ''
        })
        setDestination(getDestination(value))
    }

    const getDestination  = value => initials.destinations.filter(destination => destination.country.id === value)[0]

    const handleChangeSelect = ({ name, value }) => {
        getRate({ ...order, [name]: value })
    }
    
    const handleChangeDate = (name, date) => {
        checkDate({ ...order, [name]: date })
    }

    const handleChangerRate = ({currentTarget}) => {
        setOrder({ ...order, amount: currentTarget.value })
    }

    const formater = () => {
        const amount = parseFloat(order.amount) || 0
        return isNaN(order.amount) ? false : ({ ...order, amount })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        
        const order = formater()

        try{
            const result = editing ? await API.update(ORDERS_API, id, order) : await API.create(ORDERS_API, order)

            if(result.status === 201 || result.status === 200) {
                setPdf(result.data) 
                setOpenAlert(result.data.id)
                setup()
            } 
        } catch (error) { 
            submitted.current = true
            message.current = "Il y a des erreurs dans le formulaire"
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

    const handleClose = useCallback(() => {
        if(editing) {
            history.push(`/planning/${pdf.firstLoadingStart}`) 
        } else {
            setPdf({})
            setOpenAlert(false)
        }
    })

    const handleReset = () => {
        if(editing) {
            history.push(`/planning/${order.firstLoadingStart}`) 
        } else {
            setup()
        }
    }

    if (error) setToast(true) 
    if (!initials) return <LoadingPage/>
    
    return <PageWrap
        loading={loading}
        title={ `Ordre de Transport ${order.code || ''}`}
        message={message.current}
        open={toast}
        onClose={() => {
            message.current = ''
            setToast(false)}}
    > 
        <Container fixed>
        <form >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent >
                            <Typography className={classes.title} >Général</Typography>
                            <Select 
                                items={countries.current} onChange={ handleChangeCountry } 
                                label="Pays de destination" item={destination.country && destination.country.id}/>
                            <Select 
                                name="carrier" items={destination.carriers} onChange={ handleChangeSelect }
                                label="Transporteur"
                                item={order.carrier}
                                error={validation(order.carrier)}/>
                            <Select 
                                name="vehicle" items={initials.vehicles} onChange={ handleChangeSelect }
                                label="Véhicule"
                                item={order.vehicle}
                                error={validation(order.vehicle)}/>        
                        </CardContent>
                    </Card>    
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title}>Départ</Typography>
                            <Select 
                                name="firstLoadingWarehouse" items={initials.warehouses} onChange={ handleChangeSelect }
                                label="Premier entrepôt"
                                item={order.firstLoadingWarehouse}
                                error={validation(order.firstLoadingWarehouse)}/>
                            <Picker 
                                label="Date de départ - début" 
                                onChange={handleChangeDate} 
                                name="firstLoadingStart" 
                                value={order.firstLoadingStart}
                                minDate={moment()}
                                disablePast={true}
                                error={validation(order.firstLoadingStart)}/>     
                            <Picker 
                                label="Date de départ - fin" 
                                onChange={handleChangeDate} 
                                name="firstLoadingEnd" 
                                value={order.firstLoadingEnd}
                                minDate={order.firstLoadingStart}
                                maxDate={order.firstLoadingStart}
                                error={validation(order.firstLoadingEnd)}/>  
                        </CardContent>
                    </Card> 
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent >
                        <Typography className={classes.title}>Arrivée</Typography>
                            <Select 
                                name="firstDeliveryWarehouse" items={destination.warehouses} onChange={ handleChangeSelect }
                                label="Premier entrepôt"
                                item={order.firstDeliveryWarehouse}
                                error={validation(order.firstDeliveryWarehouse)}/>
                            <Picker 
                                label="Date d'arrivée" 
                                onChange={handleChangeDate} 
                                name="firstDelivery" 
                                value={order.firstDelivery}
                                minDate={order.secondLoadingEnd || order.firstLoadingEnd}
                                error={validation(order.firstDelivery)}/>    
                        </CardContent>
                    </Card> 
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Card className={classes.card2}>
                        <CardContent >
                            <Field 
                                label='Tarif' 
                                value={order.amount} 
                                onChange={ handleChangerRate }
                                error={NumberValidation(order.amount)}/>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <Button  
                                onClick={handleReset}
                                color="primary">
                                Annuler
                            </Button> 
                            <Button 
                                onClick={ handleSubmit } 
                                variant="contained" 
                                color="primary" 
                                disabled={disabled.current}
                            >Enregistrer</Button>
                        </CardActions>        
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card2}>
                        <CardContent>
                            <Select 
                                name="secondLoadingWarehouse" items={initials.warehouses} onChange={ handleChangeSelect }
                                label=" Second entrepôt"
                                item={order.secondLoadingWarehouse}
                                error={validation(order.secondLoadingWarehouse)}/>
                            <Picker 
                                label="Date de départ - début" 
                                onChange={handleChangeDate} 
                                name="secondLoadingStart" 
                                value={order.secondLoadingStart}
                                minDate={order.firstLoadingEnd}
                                error={validation(order.secondLoadingStart)}/>     
                            <Picker 
                                label="Date de départ - fin" 
                                onChange={handleChangeDate} 
                                name="secondLoadingEnd" 
                                value={order.secondLoadingEnd}
                                minDate={order.secondLoadingStart}
                                maxDate={order.secondLoadingStart}
                                error={validation(order.secondLoadingEnd)}/>  
                        </CardContent>
                    </Card> 
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card2}>
                        <CardContent >
                            <Select 
                                name="secondDeliveryWarehouse" items={destination.warehouses} onChange={ handleChangeSelect }
                                label="Second entrepôt"
                                item={order.secondDeliveryWarehouse}
                                error={validation(order.secondDeliveryWarehouse)}/>
                            <Picker 
                                label="Date d'arrivée" 
                                onChange={handleChangeDate} 
                                name="secondDelivery" 
                                value={order.secondDelivery}
                                minDate={order.firstDelivery} 
                                error={validation(order.secondDelivery)}/>    
                        </CardContent>
                    </Card> 
                </Grid>
            </Grid>
        </form>        
        </Container>
        <AlertDialog
            text="Enregistrement effectué, vous pouvez télécharger le PDF" 
            open={openAlert} 
            onClose={ handleClose } 
            ><Button 
                variant="contained" 
                color="primary"
                onClick={ handleClose }>
                <PDFDownloadLink
                    document={<PdfDocument order={pdf} />}
                    fileName="testPDF.pdf" 
                    >
                    {({ blob, url, loading, error }) => loading ? "Loading document..." : "Télécharger" }
                </PDFDownloadLink>
            </Button>
        </AlertDialog>
    </PageWrap> 
}
 
export default Create;

