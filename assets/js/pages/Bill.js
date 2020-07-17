import React, { useEffect, useRef, useState } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'
import moment from 'moment'
import {toast} from '../services/toast'
import Field from '../components/form/Field'
import { Container, Grid, Card, CardContent, Typography, makeStyles, Button } from '@material-ui/core';
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

const Bill = ({ match, history }) => {
    const classes = useStyles()
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
            console.log(err.response)
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

    const handleSubmit = async(e) => {  
        e.preventDefault()
        setLoading(true)
        

        try{
            const bill = formater()
            const { status } = await API.update(ORDERS_API, match.params.id, bill)
            if(status === 200) {
                toast.change('Enregistrement éffectué') 
                history.push('/liste') //filtre ?
            }
        } catch (error) {  
            submitted.current = true
            toast.change('Des erreurs dans le formulaire') 
            toast.show()  
        } 
        setLoading(false)
    }  
    
    return <PageWrap
        loading={loading}
        title={`Facturation : ${order.code || ''}`}
    > 
        <Container fixed>
            <form>
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
                                <Typography className={classes.label}>Entrepôt : <span className={classes.span}>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</span></Typography>
                                <Typography className={classes.label}>Date de début : <span className={classes.span}>{moment(order.effectiveFirstLoadingStart).format('DD/MM/YYYY à HH:mm')}</span></Typography>
                                <Typography className={classes.label}>Date de fin : <span className={classes.span}>{moment(order.effectiveFirstLoadingEnd).format('DD/MM/YYYY à HH:mm')}</span></Typography>                             
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography className={classes.title}>Arrivée</Typography>
                                <Typography className={classes.label}>Entrepôt : <span className={classes.span}>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</span></Typography>
                                <Typography className={classes.label}>Date de début : <span className={classes.span}>{moment(order.effectiveFirstDelivery).format('DD/MM/YYYY à HH:mm')}</span></Typography>                               
                            </CardContent>
                        </Card>
                    </Grid> 
                </Grid> 
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container>
                        <Grid item xs={12}><Typography className={classes.title}>Facturation - Commentaires</Typography></Grid>
                            <Grid item xs={3}>
                                <Field name='amount' variant="outlined" label='Tarif' value={bill.amount} onChange={ handleChange } error={NumberValidation(bill.amount)}/>                                     
                            </Grid>
                            <Grid item xs={3}>
                                <Field name='invoice' variant="outlined" label='Facture' value={bill.invoice} onChange={ handleChange } error={validation(bill.invoice)}/>
                            </Grid>
                            <Grid item xs={6}>  
                                <Field name='comment' variant="outlined" label='Commentaire' value={bill.comment} onChange={ handleChange } multiline/>                                   
                            </Grid>
                        </Grid>  
                    </CardContent>
                </Card>
                <Button onClick={ handleSubmit } variant="contained" color="primary">Enregistrer</Button>
            </form>
            <div><pre>{JSON.stringify(bill, null, 4)}</pre></div>   
            <div><pre>{JSON.stringify(order, null, 4)}</pre></div>   
        </Container>
    </PageWrap> 
}
 
export default Bill;