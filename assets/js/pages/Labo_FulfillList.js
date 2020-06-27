import React, { useState } from 'react';
import useSWR from 'swr';
import fetcher from '../services/api'
import { ORDERS_API}  from '../services/config'

const FulfillList = (props) => {
   //const itemsPerPage = 10;
   const [currentPage, setCurrentPage] = useState(1);

   const { data, error } = useSWR( ORDERS_API, fetcher ) 

   const handlePageChange = (page) => setCurrentPage(page);

   if (error) return <div>failed to load</div>
   if (!data) return <div>loading...</div>
   console.log(data)//////////////////////////////////////////////////////////
   const orders = data["hydra:member"]

   return <div className="card">
       <div className="card-content responsive-table-2">
           <table className="table hover">
               <tbody>
                   {orders.map( (order, key) => <tr key={key} >
                       <td>{ order.code }</td>
                       <td>{ order.firstDeliveryWarehouse ? order.firstDeliveryWarehouse.adress.country.name : ''}</td> 
                       <td>{ order.carrier ? order.carrier.name : ''}</td>
                       <td>{ order.firstLoadingStart }</td>
                   </tr>)} 
               </tbody>
           </table>
       </div>
       
   </div>
}
 
export default FulfillList;