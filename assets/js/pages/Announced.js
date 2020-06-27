import React from 'react';
import { ORDERS_API}  from '../services/config'
import List from'../components/List'

const Announced = () => {
    
    return <>
        <List url={ ORDERS_API + '?exists[effectiveFirstLoadingStart]=false' } />
    </> 
}
 
export default Announced;
