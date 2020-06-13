import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'
import DateTime from './DateTime';
import API from '../services/api'
import Select from './Select';
import {toast} from '../services/toast'

const NewTO = (props) => {
    useEffect( () =>{
        setup()
    }, [])

    const submitted = useRef(false)
    const [loading, setLoading] = useState(false)

    const [initList, setInitList] = useState ({
        countries: [], 
        warehouses: [], 
        vehicles: []
    })
    const [list, setList] = useState({
        carriers: [],
        warehouses: []
    })
    const [order, setOrder] = useState({})
    const [params, setParams] = useState({})

    const setup = async () => {
        setLoading(true)
        setInitList({
            countries: [], 
            warehouses: [], 
            vehicles: []
        })
        setList({
            carriers: [],
            warehouses: []
        })
        setOrder({})
        setParams({})
        try{
            const initList = await API.setup()
            setInitList(initList)  
            
        }catch (error) {
            toast.show()
        } 
        setLoading(false)
    }

    const handleChangeCountry = async ({currentTarget}) => {
        setLoading(true)
        try{
            const list = await API.findAllByCountry(currentTarget.value)
            setList(list)

            setParams ({})
        }catch (error) {
            toast.show()
        } 
        setLoading(false)
    }

    const handleChangeSelect = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setParams({ ...params, [name]: value })
    }
    
    const handleChangeDate = (name, date) => {
        setOrder({ ...order, [name]:date })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        submitted.current = true
        try{
            const { status } = await API.create(order, params)
            if(status === 201) {
                toast.change('Enregistrement éffectué')
                submitted.current = false
                setup() 
            } 
        } catch (error) {   } 
        toast.show() 
        setLoading(false)
    }

    const validation = valid => {
        if( submitted.current && (!valid || valid === '0' )) {
            return "txt-red"
        }
    }

      
    return <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <div className="container">
            <form className="form-grix xs1" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label >Pays de destination</label>
                    <Select items={initList.countries} onChange={ handleChangeCountry } value =""/>
                </div>
                <hr/>
                <div className="form-field">
                    <label >condition de départ</label>
                    <div className="form-field inline">
                        <label className={validation(params.carrier)}>Transporteur</label> 
                        <Select name="carrier" items={list.carriers} onChange={ handleChangeSelect } />
                    </div>
                    <div className="form-field inline">
                        <label className={validation(params.vehicle)}>Vehicule</label>
                        <Select name="vehicle" items={initList.vehicles} onChange={ handleChangeSelect }/>
                    </div>
                    <div className="form-field inline">
                        <label className={validation(params.firstLoadingWarehouse)}>Entrepôt</label>
                        <Select name="firstLoadingWarehouse" items={initList.warehouses} onChange={ handleChangeSelect }/>
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
                        <label className={validation(params.firstDeliveryWarehouse)}>Entrepôt</label>
                        <Select name="firstDeliveryWarehouse" items={list.warehouses} onChange={ handleChangeSelect }/>
                    </div>  
                    <div className="form-field inline">
                        <label className={validation(order.firstDelivery)}>Date d'arrivé</label>  
                        <DateTime startDate={order.firstDelivery} setStartDate={handleChangeDate} name="firstDelivery"/>
                        </div>    
                </div>
                <button className="btn blue">Submit</button>
            </form>
        </div>
    </>                
}

const newToElement = document.querySelector('#react-new-TO')

if (newToElement) {
    ReactDOM.render(<NewTO />, newToElement)
}


