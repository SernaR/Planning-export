import React, { useState } from 'react';
import { ORDERS_API}  from '../services/config'
import List from'../components/List'

const Orders = (props) => {
    const [search, setSearch] = useState({
        code:'',
        carrier: '',
        country: ''
    })
    const [url, setUrl] = useState(ORDERS_API)

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setSearch({ ...search, [name]: value });
    }

    const handleClick = () => {
        setUrl( getUrl() )
        //desactiver boutton pagination (bootstrap)
    }

    const getUrl = () => {
        const { code, carrier, country } = search
        const filters = []

        if(code === '' && carrier === '' && country === '') {
            return ORDERS_API
        }
        
        if(code !== '' ) {
            filters.push('code=' + code)
        }

        if(carrier !== '' ) {
            filters.push('carrier.name=' + carrier)
        }

        if(country !== '' ) {
            filters.push( 'firstDeliveryWarehouse.adress.country.name=' + country)
        }

        return ORDERS_API + '?' + filters.join('&')
    }

    return <>
        <div className="card">
            <div className="form-field card-content">
                <div className="grix xs4">
                    <input type="text" className="form-control" placeholder="Ordre de transport" name="code" value={search.code} onChange={handleChange}/>
                    <input type="text" className="form-control" placeholder="Transporteur" name="carrier" value={search.carrier} onChange={handleChange}/>
                    <input type="text" className="form-control" placeholder="Pays" name="country" value={search.country} onChange={handleChange}/>
                    <button type="submit" className="btn btn-primary mt-2 btn-block" onClick={handleClick}>Rechercher</button>
                </div>    
            </div>
        </div>   
        <List url={ url } />
    </> 
}
 
export default Orders;
