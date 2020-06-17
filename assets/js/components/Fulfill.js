import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom'
import {toast} from '../services/toast'
import API from '../services/api'
import DateTime from './form/DateTime';

const Fulfill = ({orderId}) => {

    useEffect( () =>{
        const setup = async () => {
            setLoading(true)
            try{
                const order = await API.fulfill(orderId)
                setOrder({...order})  
                
            }catch (error) {
                toast.show()
            } 
            setLoading(false)
        }
    
        setup()
    }, [])

    const submitted = useRef(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState({})
    const [updates, setUpdates] = useState({})

    const handleChangeDate =() => {}

    const handleSubmit = e => { 
        e.preventDefault() 
        console.log(order)
    }
    const validation = valid => {
        if( submitted.current && (!valid || valid === '0' )) {
            return "txt-red"
        }
    }

    return ( <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <section className="container">
            <form className="form-grix xs1" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label >condition de départ</label>
                    <div className="form-field inline">
                        <label>Transporteur</label> 
                        <input type="text" className="form-control" disabled value={order.carrier} />
                    </div>
                    <div className="form-field inline">
                        <label >Entrepôt</label>
                        <input type="text" className="form-control" disabled value={order.firstLoadingWarehouse} />
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.firstLoadingStart)}>Date de départ - début</label>
                        <DateTime startDate={order.firstLoadingStart} setStartDate={handleChangeDate} name="firstLoadingStart" />
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.firstLoadingEnd)}>Date de départ - fin</label>
                        <DateTime startDate={order.firstLoadingEnd} setStartDate={handleChangeDate} name="firstLoadingEnd"/>
                    </div>
                </div>
                <hr/>
                <div className="form-field">
                    <label >condition d'arrivé</label>
                    <div className="form-field inline">
                        <label >Entrepôt</label>
                        <input type="text" className="form-control" disabled value={order.firstDeliveryWarehouse} />
                    </div>  
                    <div className="form-field inline">
                        <label className={validation(order.firstDelivery)}>Date d'arrivé</label>  
                        <DateTime startDate={order.firstDelivery} setStartDate={handleChangeDate} name="firstDelivery"/>
                    </div>    
                </div>
                <button className="btn blue">Submit</button> 
            </form>
            <pre>{ JSON.stringify(order.order, null, 4) }</pre> 
        </section>
    </>);
}
 
export default Fulfill;


const fulfillElement = document.querySelector('#react-fulfill')


if (fulfillElement) {
    const orderId = fulfillElement.dataset.order
    ReactDOM.render(<Fulfill orderId={orderId}/>, fulfillElement)
}

