import React, { useState, useRef } from 'react';
import { CREATE_SETUP_API, ORDERS_API }  from '../services/config'
import API from '../services/api'

import Select from '../components/form/Select';
import DateTime from '../components/form/DateTime';

import paramsAPI from '../services/paramsAPI'
import rateAPI from '../services/rateAPI'
import {toast} from '../services/toast'
import useSWR from 'swr';

import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "../components/PdfDocument";

const Create = (props) => {

    const { data: initials, error } = useSWR( CREATE_SETUP_API, API.fetcher )
    
    const submitted = useRef(false)
    const [loading, setLoading] = useState(false)
  
    const [list, setList] = useState({
        carriers: [],
        warehouses: []
    })
    const [order, setOrder] = useState({})
    const [pdf, setPdf] = useState({})

    const setup = () => {
        submitted.current = false
        setList({
            carriers: [],
            warehouses: []
        })
        setOrder({})
        setPdf({})
    }

    const getRate = (order) => { 
        if (order.carrier && order.firstLoadingWarehouse && order.firstDeliveryWarehouse) {
            setLoading(true)
            rateAPI.find(order)
                .then( amount=> {
                    setOrder({ ...order, amount })
                    setLoading(false)
                }) 
                .catch(error => toast.show()) 
        } else {
            setOrder(order)
        }
    }

    const handleChangeCountry = async ({currentTarget}) => {
        setLoading(true)
        try{
            const list = await paramsAPI.findAll(currentTarget.value)
            setList(list)
        }catch (error) {
            toast.show()
        } 
        setLoading(false)
    }

    const handleChangeSelect = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        getRate({ ...order, [name]: value })
    }
    
    const handleChangeDate = (name, date) => {
        setOrder({ ...order, [name]: date })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        //test validité date 3>2>1
        
        setLoading(true)
        submitted.current = true

        try{
            const { data, status } = await API.create(ORDERS_API, order)
            if(status === 201) {
                console.log(data)
                toast.change('Enregistrement éffectué')
                setPdf(data) 
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

    if (error) return <div>failed to load</div>
    if (!initials) return <div className="progress indeterminate">
        <div className="progress-bar secondary dark-1"></div>
    </div>

    return <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <section className="container">
            <form className="form-grix xs1">
                <div className="form-field">
                    <label >Pays de destination</label>
                    <Select items={initials.countries} onChange={ handleChangeCountry } />
                </div>
                <hr/>
                <div className="form-field">
                    <label >condition de départ</label>
                    <div className="form-field inline">
                        <label className={validation(order.carrier)}>Transporteur</label> 
                        <Select name="carrier" items={list.carriers} onChange={ handleChangeSelect } />
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.vehicle)}>Vehicule</label>
                        <Select name="vehicle" items={initials.vehicles} onChange={ handleChangeSelect }/>
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.firstLoadingWarehouse)}>Entrepôt</label>
                        <Select name="firstLoadingWarehouse" items={initials.warehouses} onChange={ handleChangeSelect }/>
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.firstLoadingStart)}>Date de départ - début</label>
                        <DateTime minDate={new Date()} startDate={order.firstLoadingStart} setStartDate={handleChangeDate} name="firstLoadingStart" />
                    </div>
                    <div className="form-field inline">
                        <label className={validation(order.firstLoadingEnd)}>Date de départ - fin</label>
                        <DateTime minDate={order.firstLoadingStart} startDate={order.firstLoadingEnd} setStartDate={handleChangeDate} name="firstLoadingEnd"/>
                    </div>
                </div>
                <hr/>
                <div className="form-field">
                    <label >condition d'arrivé</label>
                    <div className="form-field inline">
                        <label className={validation(order.firstDeliveryWarehouse)}>Entrepôt</label>
                        <Select name="firstDeliveryWarehouse" items={list.warehouses} onChange={ handleChangeSelect }/>
                    </div>  
                    <div className="form-field inline">
                        <label className={validation(order.firstDelivery)}>Date d'arrivé</label>  
                        <DateTime minDate={order.firstLoadingEnd} startDate={order.firstDelivery} setStartDate={handleChangeDate} name="firstDelivery"/>
                    </div> 
                    <div className="form-field inline">
                        <label className={validation(order.amount)}>Tarif</label>  
                        <span>{order.amount}</span>
                    </div>    
                </div> 
                { !submitted.current && 
                    <button className="btn blue" onClick={handleSubmit}> Submit </button>
                || <div className="flex">
                    <PDFDownloadLink
                        document={<PdfDocument order={order} />}
                        fileName="testPDF.pdf"
                        className="btn blue mr-2"
                    >
                    {({ blob, url, loading, error }) => loading ? "Loading document..." : "Download" }
                    </PDFDownloadLink>
                    <button className="btn blue mr-2" onClick={setup}> Suivant </button>
                    <button className="btn blue mr-2" onClick={setup}> Retour </button>
                </div> }
            </form>
        </section>
        <div><pre>{JSON.stringify(order, null, 4)}</pre></div>
    </> 
}
 
export default Create;

