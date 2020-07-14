import React, { useEffect, useRef, useState } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'
import {toast} from '../services/toast'
import ProgressBar from '../components/ui/ProgressBar';
import Hero from '../components/ui/Hero';
import Field from '../components/form/Field'
import { Container, Grid, Card, CardContent, Typography, makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
      margin: '1em auto',
      paddingBottom: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(2)
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
                //...bill, 
                amount: order.amount, 
                invoice:order.invoice || '',
                comment: order.comment || ''
            })
        } catch(err){
            console.log(err.response)
        }
        setLoading(false)    
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
       
        if(isNaN(amount)){
            return false
        } else {
            return ({ ...bill, amount})
        }   
    }

    const handleSubmit = async(e) => {  
        e.preventDefault()
        setLoading(true)
        submitted.current = true

        try{
            const bill = formater()
            const {data, status} = await API.update(ORDERS_API, match.params.id, bill)
            if(status === 200) {
                toast.change('Enregistrement éffectué') 
                history.push('/liste') //filtre ?
            }
        } catch (error) {    
            toast.change('Des erreurs dans le formulaire') 
        } 
        toast.show()  
        setLoading(false)
    }  
    
    return ( <>
        { loading && <ProgressBar /> || <div style={{height: '4px' }}></div>}
        <Hero title={order.code}/>
        <Container fixed>
            <form>
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
                            <CardContent >
                                <Typography variant='h3'>Départ</Typography>
                                <Typography variant='body1'>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</Typography>
                                <Typography variant='body1'>{order.effectiveFirstLoadingStart}</Typography>
                                <Typography variant='body1'>{order.effectiveFirstLoadingEnd}</Typography>                                
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={4}>
                        <Card className={classes.card}>
                            <CardContent >
                                <Typography variant='h3'>Arrivé</Typography>
                                <Typography variant='body1'>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</Typography>
                                <Typography variant='body1'>{order.effectiveFirstDelivery}</Typography>                               
                            </CardContent>
                        </Card>
                    </Grid> 
                </Grid> 
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container>
                        <Grid item xs={12}><Typography variant='h3'>Commentaires</Typography></Grid>
                            <Grid item xs={3}>
                                <Field name='amount' variant="outlined" label='Tarif' value={bill.amount} onChange={ handleChange } error={NumberValidation(bill.amount)}/>                                     
                            </Grid>
                            <Grid item xs={3}>
                                <Field name='invoice' variant="outlined" label='Facture' value={bill.invoice} onChange={ handleChange } />
                            </Grid>
                            <Grid item xs={6}>  
                                <Field name='comment' variant="outlined" label='Commentaire' value={bill.comment} onChange={ handleChange } multiline/>                                   
                            </Grid>
                        </Grid>  
                    </CardContent>
                </Card>
                <Button className={classes.button} onClick={ handleSubmit } variant="contained" color="primary">Enregistrer</Button>
            </form>
            <div><pre>{JSON.stringify(bill, null, 4)}</pre></div>   
            <div><pre>{JSON.stringify(order, null, 4)}</pre></div>   
        </Container>
    </> )
}
 
export default Bill;