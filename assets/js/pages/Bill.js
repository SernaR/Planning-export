import React, { useEffect, useRef, useState } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'
import {toast} from '../services/toast'

const Bill = ({ match, history }) => {
    const [order, setOrder] = useState({
        amount: '',
        invoice: '',
        comment: ''
    })
    const [loading, setLoading] = useState(false)
    const submitted = useRef(false)

    useEffect( () => {
        fetchOrder()
    }, [])

    const fetchOrder = async()  => {
        setLoading(true)
        try{
            const{ code, amount } = await API.find(ORDERS_API, match.params.id)
            setOrder({ ...order, code, amount })
        } catch(err){
            console.log(err.response)
        }
        setLoading(false)    
    }

    const NumberValidation = number => {
        if( submitted.current && (!number || (isNaN(number)) )) {
            return "txt-red"
        }
    }

    const validation = valid => {
        if( submitted.current && (!valid || valid === '0' )) {
            return "txt-red"
        }
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget
        setOrder({ ...order, [name]: value })
    }

    const formater = () => {
        const amount = parseFloat(order.amount)
       
        if(isNaN(amount)){
            return false
        } else {
            return ({ ...order, amount})
        }   
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        submitted.current = true

        try{
            const order = formater()
            const {data, status} = await API.update(ORDERS_API, match.params.id, order)
            if(status === 200) {
                toast.change('Enregistrement éffectué') 
                history.push('/ordres/liste') //filtre ?
            }
        } catch (error) {    
            toast.change('Des erreurs dans le formulaire') 
        } 
        toast.show()  
        setLoading(false)
    }    

    return ( <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <section className="container">
            <form className="form-grix xs1" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label >Ordre de transport</label>
                    { order.code }
                </div>
                <div className="form-field">
                    <label className={NumberValidation(order.amount)}>Montant</label> 
                    <input type="text" name="amount" className="form-control" value={order.amount} onChange={handleChange} />
                   
                </div>
                <div className="form-field">
                    <label className={validation(order.invoice)}>Facture</label> 
                    <input type="text" name="invoice" className="form-control" value={order.invoice} onChange={handleChange} />
                   
                </div>
                <div className="form-field">
                    <label >Commentaire</label> 
                    <textarea name="comment" className="form-control" value={order.comment} onChange={handleChange} />
                </div>
                <button className="btn blue">Submit</button>
            </form>
            <div><pre>{JSON.stringify(order, null, 4)}</pre></div>   
        </section>
    </> )
}
 
export default Bill;