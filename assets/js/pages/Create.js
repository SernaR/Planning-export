import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CREATE_SETUP_API, ORDERS_API }  from '../services/config'
import API from '../services/api'
import Hero from '../components/ui/Hero';

import Field from '../components/form/Field';
import Select from '../components/form/Selection';
import Picker from '../components/form/DateTimePicker';

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
import { Typography } from '@material-ui/core';
import LoadingPage from '../components/ui/LoadingPage';
import AlertDialog from '../components/ui/AlertDialog';
import PageWrap from '../components/ui/PageWrap';

const useStyles = makeStyles((theme) => ({
    card: {
      margin: '1em auto',
      paddingLeft:theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    title: {
        paddingBottom: theme.spacing(2),
        textAlign: 'center',
        fontSize: '2em'
    }
}))
  

const Create = ({match, history}) => {
    const classes = useStyles();
    const { id } = match.params;

    const { data: initials, error } = useSWR( CREATE_SETUP_API, API.fetcher )
    
    const [country, setCountry] = useState('')

    const [list, setList] = useState({})
    const [order, setOrder] = useState({})
    const [pdf, setPdf] = useState({})
    
    const submitted = useRef(false)
    const disabled = useRef(true)

    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);

    const setup = () => {
        setCountry('')
        setList({})
        setOrder({})
        
        submitted.current = false
        disabled.current = true
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
            checkDate({  
                carrier: order.carrier['@id'],
                vehicle: order.vehicle['@id'],
                firstLoadingWarehouse: order.firstLoadingWarehouse['@id'],
                firstLoadingStart: order.firstLoadingStart,
                firstDeliveryWarehouse: order.firstDeliveryWarehouse['@id'],
                firstLoadingEnd: order.firstLoadingEnd,
                firstDelivery: order.firstDelivery,
                amount: order.amount || ''
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

    const checkDate = (order) => {
        if (order.firstLoadingStart && order.firstLoadingEnd && order.firstDelivery) {
            disabled.current = (order.firstDelivery>order.firstLoadingEnd && order.firstLoadingEnd>order.firstLoadingStart)? false : true
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
        setCountry(value)
    }

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
            toast.change('Des erreurs dans le formulaire')
            toast.show()  
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
            history.push('/planning') //filtre ?************************
        } else {
            setPdf({})
            setOpenAlert(false)
        }
    })

    if (error) return <div>failed to load</div> //toast ??
    if (!initials) return <LoadingPage />

    return <PageWrap
        loading={loading}
        title="Order de Tansport"
    > 
        <Container fixed>
        <form >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent >
                            <Typography className={classes.title} >Géneral</Typography>
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
                            <Typography className={classes.title}>Départ</Typography>
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
                        <Typography className={classes.title}>Arrivé</Typography>
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
                            <Field 
                                label='Tarif' 
                                value={order.amount} 
                                onChange={ handleChangerRate }
                                error={NumberValidation(order.amount)}/>
                        </CardContent>
                    </Card> 
                </Grid>
            </Grid>
            <Button onClick={ handleSubmit } variant="contained" color="primary" disabled={disabled.current}>Enregistrer</Button>
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
                    {({ blob, url, loading, error }) => loading ? "Loading document..." : "Download" }
                </PDFDownloadLink>
            </Button>
        </AlertDialog>
        <div><pre>{JSON.stringify(order, null, 4)}</pre></div>
        <div><pre>{JSON.stringify(pdf, null, 4)}</pre></div>
    </PageWrap> 
}
 
export default Create;

