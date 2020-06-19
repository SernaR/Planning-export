import React, { useState, useRef, useEffect } from 'react';
import { CREATE_SETUP_API }  from '../services/config'
import fetcher from '../services/api'

import Select from '../components/form/Select';
import DateTime from '../components/form/DateTime';

import paramsAPI from '../services/paramsAPI'
import {toast} from '../services/toast'
import useSWR from 'swr';

const Create = (props) => {
    /*useEffect( () =>{
        setup()
    }, [])*/

    const { data, error } = useSWR( CREATE_SETUP_API, fetcher )
    //const [initList, setInitList] = useState(data)

    const submitted = useRef(false)
    const [loading, setLoading] = useState(false)

  
    const [list, setList] = useState({
        carriers: [],
        warehouses: []
    })
    const [order, setOrder] = useState({
        carrier: 'n',
        firstLoadingWarehouse: 'n',
        firstDeliveryWarehouse: 'n',
    })
    const [params, setParams] = useState({})

    const setup = async () => {
        setList({
            carriers: [],
            warehouses: []
        })
        setOrder({})
        setParams({})
    }

    const getRate = () => {
        if (order.carrier && order.firstLoadingWarehouse && order.firstDeliveryWarehouse) return 'plop'
    }

    const handleChangeCountry = async ({currentTarget}) => {
        setLoading(true)
        try{
            const list = await paramsAPI.findAll(currentTarget.value)
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
        alert(getRate())
        /*setLoading(true)
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
        setLoading(false)*/
    }

    const validation = valid => {
        if( submitted.current && (!valid || valid === '0' )) {
            return "txt-red"
        }
    }

    if (error) return <div>failed to load</div>
    if (!data) return <div className="progress indeterminate">
        <div className="progress-bar secondary dark-1"></div>
    </div>
  
      
    return <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <section className="container">
            <form className="form-grix xs1" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label >Pays de destination</label>
                    <Select items={data.countries} onChange={ handleChangeCountry } />
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
                        <Select name="vehicle" items={data.vehicles} onChange={ handleChangeSelect }/>
                    </div>
                    <div className="form-field inline">
                        <label className={validation(params.firstLoadingWarehouse)}>Entrepôt</label>
                        <Select name="firstLoadingWarehouse" items={data.warehouses} onChange={ handleChangeSelect }/>
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
        </section>
    </> 
}
 
export default Create;