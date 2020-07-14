import React, { useState, useRef, useEffect } from 'react';
import { CREATE_SETUP_API, ORDERS_API }  from '../services/config'
import API from '../services/api'
import Hero from '../components/ui/Hero';

import Field from '../components/form/Field';
import Select from '../components/form/Selection';
import Picker from '../components/form/DateTimePicker';
import ProgressBar from '../components/ui/ProgressBar'

import paramsAPI from '../services/paramsAPI'
import rateAPI from '../services/rateAPI'
import {toast} from '../services/toast'
import useSWR from 'swr';

import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "../components/PdfDocument";

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Typography, Divider } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    card: {
      margin: '1em auto',
      paddingBottom: theme.spacing(2)
    },
}))
  

const Create = ({match}) => {
    const classes = useStyles();
    const { id } = match.params;

    const { data: initials, error } = useSWR( CREATE_SETUP_API, API.fetcher )
    
    const submitted = useRef(false)
    const [country, setCountry] = useState('')
    const [loading, setLoading] = useState(false)
  
    const [list, setList] = useState({})
    const [order, setOrder] = useState({})
    const [pdf, setPdf] = useState({})
    const [editing, setEditing] = useState(false)

    const setup = () => {
        submitted.current = false
        setList({})
        setOrder({})
        setPdf({})
    }

    const fetchCountryParams = async () => {
        setLoading(true)
        try{
            const list = await paramsAPI.findAll(country)
            setList(list)
        }catch (error) {
            toast.show()
        } 
        setLoading(false)
    }

    useEffect(() => {
        fetchCountryParams()
    }, [country])


    const fetchData = async(id) => {
        try {
            const order = await API.find(ORDERS_API, id)
            setCountry( order.country.id)
            setOrder({
                carrier: order.carrier['@id'],
                vehicle: order.vehicle['@id'],
                firstLoadingWarehouse: order.firstLoadingWarehouse['@id'],
                firstLoadingStart: order.firstLoadingStart,
                firstDeliveryWarehouse: order.firstDeliveryWarehouse['@id'],
                firstLoadingEnd: order.firstLoadingEnd,
                firstDelivery: order.firstDelivery,
                amount: order.amount
            })
        }catch(err) {
            alert('error')
            console.log(err)
        }
    }

    useEffect(() => {
        if(id !== "nouveau") {
            setEditing(true);
            fetchData(id);
        } 
    }, [id])

    const getRate = (order) => { 
        if (order.carrier && order.firstLoadingWarehouse && order.firstDeliveryWarehouse) {
            setLoading(true)
            rateAPI.find(order)
                .then( amount=> {
                    setOrder({ ...order, amount })   
                }) 
                .catch(error => {
                    setOrder(order)   
                    toast.change('pas de tarif sur ce schema')
                    toast.show()
                }) 
        } else {
            setOrder(order)
        }
        setLoading(false)
    }

    const handleChangeCountry = ({value}) => {
        setOrder({ ...order,
            firstDeliveryWarehouse: '',
            carrier: '',
            firstLoadingWarehouse: '',
            amount: null
        })
        setCountry(value)
    }

    const handleChangeSelect = ({ name, value }) => {
        getRate({ ...order, [name]: value })
    }
    
    const handleChangeDate = (name, date) => {
        setOrder({ ...order, [name]: date })
    }

    const handleChangerRate = ({currentTarget}) => {
        const amount = parseFloat(currentTarget.value)
        setOrder({ ...order, amount })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        setLoading(true)
        submitted.current = true

        if(!(order.firstDelivery>order.firstLoadingEnd && order.firstLoadingEnd>order.firstLoadingStart)){
            toast.change('Des erreurs dans les dates')
        }else {
            let resultCode
            try{
                if(editing) {
                    const { data, status } = await API.update(ORDERS_API, id, order)
                    resultCode = status
                }else {
                    const { data, status } = await API.create(ORDERS_API, order)
                    resultCode = status
                }
                if(resultCode === 201 || resultCode === 200) {
                    toast.change('Enregistrement éffectué')
                    //setPdf(data) 
                } 
            } catch (error) {    
                toast.change('Des erreurs dans le formulaire') 
            }
        }
        toast.show()  
        setLoading(false)
    }

    const validation = valid => {
        return ( submitted.current && (!valid || valid === '0' ))
    }

    if (error) return <div>failed to load</div>
    if (!initials) return <div className="progress indeterminate">
        <div className="progress-bar secondary dark-1"></div>
    </div>

    return <>
        { loading && <ProgressBar /> || <div style={{height: '4px' }}></div>}
        <Hero/>
        <Container fixed>
        <form >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent >
                            <Typography variant='h3'>Géneral</Typography>
                            <Divider />
                            <Select 
                                items={initials.countries} onChange={ handleChangeCountry } 
                                label="Pays de destination" item={country}/>
                            <Select 
                                name="carrier" items={list.carriers} onChange={ handleChangeSelect }
                                label="Transporteur"
                                item={order.carrier}
                                error={validation(order.carrier)}/>
                            <Select 
                                name="vehicle" items={initials.vehicles} onChange={ handleChangeSelect }
                                label="Vehicule"
                                item={order.vehicle}
                                error={validation(order.vehicle)}/>        
                        </CardContent>
                    </Card>    
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant='h3'>Départ</Typography>
                            <Select 
                                name="firstLoadingWarehouse" items={initials.warehouses} onChange={ handleChangeSelect }
                                label="Entrepôt"
                                item={order.firstLoadingWarehouse}
                                error={validation(order.firstLoadingWarehouse)}/>
                            <Picker 
                                label="Date de départ - début" 
                                onChange={handleChangeDate} 
                                name="firstLoadingStart" 
                                value={order.firstLoadingStart}
                                disablePast={true}
                                error={validation(order.firstLoadingStart)}/>     
                            <Picker 
                                label="Date de départ - fin" 
                                onChange={handleChangeDate} 
                                name="firstLoadingEnd" 
                                value={order.firstLoadingEnd}
                                minDate={order.firstLoadingStart}
                                error={validation(order.firstLoadingEnd)}/>  
                        </CardContent>
                    </Card> 
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent >
                        <Typography variant='h3'>Arrivé</Typography>
                            <Select 
                                name="firstDeliveryWarehouse" items={list.warehouses} onChange={ handleChangeSelect }
                                label="Entrepôt"
                                item={order.firstDeliveryWarehouse}
                                error={validation(order.firstDeliveryWarehouse)}/>
                            <Picker 
                                label="Date d'arrivé" 
                                onChange={handleChangeDate} 
                                name="firstDelivery" 
                                value={order.firstDelivery}
                                minDate={order.firstLoadingEnd}
                                error={validation(order.firstDelivery)}/>    
                            <Field label='Tarif' value={order.amount} onChange={ handleChangerRate }/>
                        </CardContent>
                    </Card> 
                </Grid>
            </Grid>
            <Button onClick={ handleSubmit } variant="contained" color="primary">Enregistrer</Button>
        </form>        
        </Container>
        
        { 1 === 0 && <div className="flex">
            <PDFDownloadLink
                document={<PdfDocument order={order} />}
                fileName="testPDF.pdf"
                className="btn blue mr-2"
            >
            {({ blob, url, loading, error }) => loading ? "Loading document..." : "Download" }
            </PDFDownloadLink>
            <button className="btn blue mr-2" onClick={setup}> Suivant </button>
            <button className="btn blue mr-2" onClick={setup}> Retour </button>
        </div>}
      
        <div><pre>{JSON.stringify(order, null, 4)}</pre></div>
    </> 
}
 
export default Create;
