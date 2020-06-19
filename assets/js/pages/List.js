import React from 'react';
import useSWR from 'swr'
import fetcher from '../services/api'
import { ORDERS_API}  from '../services/config'


const List = (props) => {
    const { data, error } = useSWR( ORDERS_API, fetcher )
    
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return <div>
        {data.map( order => <p>{order.code} - {order.carrier.name}</p>)}
    </div>
}
 
export default List;