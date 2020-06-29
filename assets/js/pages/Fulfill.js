import React, { useEffect, useState, useRef } from 'react';
import { ORDERS_API}  from '../services/config'
import API from '../services/api'

import DateTime from '../components/form/DateTime';
import {toast} from '../services/toast'
 
const Fulfill = ({ match, history }) => {
    const [order, setOrder] = useState({})
    const [fulfill, setFulfill] = useState({
        amount: '',
        effectiveFirstLoadingBoxes: '',
        effectiveFirstLoadingPallets: '', 
        effectiveFirstLoadingPieces: '',
        weight: '', 
        volume: '',
    })

    const [loading, setLoading] = useState(false)
    const submitted = useRef(false)

    useEffect( () => {
        fetchOrder()
    }, [])

    const fetchOrder = async() => {
        setLoading(true)
        try{
            const {
                amount, weight, volume,
                effectiveFirstLoadingBoxes, effectiveFirstLoadingPallets, effectiveFirstLoadingPieces,
                firstLoadingStart, effectiveFirstLoadingStart, 
                firstLoadingEnd, effectiveFirstLoadingEnd, 
                firstDelivery, effectiveFirstDelivery, 
                code, carrier, firstLoadingWarehouse, firstDeliveryWarehouse
            } = await API.find(ORDERS_API, match.params.id) 
            setOrder({ code, carrier, firstLoadingWarehouse, firstDeliveryWarehouse })
            setFulfill({
                amount: amount || '',
                weight: weight || '', 
                volume: volume|| '',
                effectiveFirstLoadingBoxes: effectiveFirstLoadingBoxes || '', 
                effectiveFirstLoadingPallets: effectiveFirstLoadingPallets || '', 
                effectiveFirstLoadingPieces: effectiveFirstLoadingPieces || '',
                effectiveFirstLoadingStart: effectiveFirstLoadingStart ? effectiveFirstLoadingStart : firstLoadingStart,
                effectiveFirstLoadingEnd: effectiveFirstLoadingEnd ? effectiveFirstLoadingEnd :firstLoadingEnd,
                effectiveFirstDelivery: effectiveFirstDelivery ? effectiveFirstDelivery :firstDelivery
            }) 
        } catch(err){
            console.log(err.response)
        }
        setLoading(false)
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
        
        try{
            const fulfill = formater()
            const {data, status} = await API.update(ORDERS_API, match.params.id, fulfill)
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

    const validation = valid => {
        if( submitted.current && (!valid || valid === '0' )) {
            return "txt-red"
        }
    }

    const NumberValidation = number => {
        if( submitted.current && (!number || (isNaN(number)) )) {
            return "txt-red"
        }
    }

    if (!order) return <div className="progress indeterminate">
        <div className="progress-bar secondary dark-1"></div>
    </div>

    return  <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <section className="container">
            <form className="form-grix xs1" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label >Ordre de transport</label>
                    { order.code }
                </div>
                <hr/>
                <div className="form-field">
                    <label >condition de départ</label>
                    <div className="form-field inline">
                        <label className={validation(order.carrier)}>Transporteur</label> 
                        {order.carrier && order.carrier.name}
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.firstLoadingWarehouse)}>Entrepôt</label>
                        {order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}
                    </div>
                    <div className="form-field inline">
                        <label className={validation(fulfill.effectiveFirstLoadingStart)}>Date de départ - début</label>
                        <DateTime minDate={Date.parse(fulfill.effectiveFirstLoadingStart)} startDate={Date.parse(fulfill.effectiveFirstLoadingStart)} setStartDate={handleChangeDate} name="effectiveFirstLoadingStart" />
                    </div>
                    <div className="form-field inline">
                        <label className={validation(fulfill.effectiveFirstLoadingEnd)}>Date de départ - fin</label>
                        <DateTime minDate={Date.parse(fulfill.effectiveFirstLoadingEnd)} startDate={Date.parse(fulfill.effectiveFirstLoadingEnd)} setStartDate={handleChangeDate} name="effectiveFirstLoadingEnd"/>
                    </div>
                </div>
                <hr/>
                <div className="form-field">
                    <label >condition d'arrivé</label>
                    <div className="form-field inline">
                        <label className={validation(order.firstDeliveryWarehouse)}>Entrepôt</label>
                        { order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name }
                    </div>  
                    <div className="form-field inline">
                        <label className={validation(fulfill.effectiveFirstDelivery)}>Date d'arrivé</label>  
                        <DateTime minDate={Date.parse(fulfill.effectiveFirstDelivery)} startDate={Date.parse(fulfill.effectiveFirstDelivery)} setStartDate={handleChangeDate} name="effectiveFirstDelivery"/>
                    </div> 
                    <div className="form-field inline">
                        <label className={NumberValidation(fulfill.amount)}>Tarif</label>  
                        <input type="text" name="amount" className="form-control" value={fulfill.amount} onChange={handleChange} />
                    </div>    
                </div>
                <button className="btn blue">Submit</button>
                <hr/>
                <div className="form-field">
                    <label >Quantité réalisé</label>
                    <div className="form-field inline">
                        <label className={NumberValidation(fulfill.effectiveFirstLoadingBoxes)}>Colis</label>  
                        <input type="number" name="effectiveFirstLoadingBoxes" className="form-control" value={fulfill.effectiveFirstLoadingBoxes} onChange={handleChange} />
                    </div> 
                    <div className="form-field inline">
                        <label className={NumberValidation(fulfill.effectiveFirstLoadingPallets)}>Palettes</label>  
                        <input type="number" name="effectiveFirstLoadingPallets" className="form-control" value={fulfill.effectiveFirstLoadingPallets} onChange={handleChange} />
                    </div> 
                    <div className="form-field inline">
                        <label className={NumberValidation(fulfill.effectiveFirstLoadingPieces)}>Pièces</label>  
                        <input type="number" name="effectiveFirstLoadingPieces" className="form-control" value={fulfill.effectiveFirstLoadingPieces} onChange={handleChange} />
                    </div> 
                    <div className="form-field inline">
                        <label className={NumberValidation(fulfill.weight)}>Poids</label>  
                        <input type="number" name="weight" className="form-control" value={fulfill.weight} onChange={handleChange} />
                    </div> 
                    <div className="form-field inline">
                        <label className={NumberValidation(fulfill.volume)}>Volume</label>  
                        <input type="number" name="volume" className="form-control" value={fulfill.volume} onChange={handleChange} />
                    </div> 
                </div>    
            </form>
        </section>
        <div><pre>{JSON.stringify(fulfill, null, 4)}</pre></div>   
    </> 
}
 
export default Fulfill;

//