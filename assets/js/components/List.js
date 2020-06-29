import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';

const List = ({url}) => {
    const [loading, setLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0);
    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    useEffect( () => {
        setLoading(true);
        const and = url.includes('?') ? '&' : '?'

        axios.get(url + and + 'page=' + currentPage)
            .then( response => {
                console.log(response.data["hydra:member"])
                setOrders(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    },  [currentPage, url] );

    const handlePageChange = (page) => setCurrentPage(page);

    const fulfilled = (id, loaded) => {
        let text = 'A confirmer'
        let status = 'primary'
        if(loaded) {
            text = 'Réalisé'
            status = 'secondary'
        }
        return <Link to={'/ordres/annonce/ordre/' + id} className={"btn small rounded-4 " + status}>{text}</Link>
    }

    const bill = (id, paid) => {
        let text = 'A payer'
        let status = 'primary'
        if(paid) {
            text = 'Facturé'
            status = 'secondary'
        }
        return <Link to={'/ordres/facturation/ordre/' + id} className={"btn small rounded-4 " + status}>{text}</Link>
    }

    return <>
        { loading && <div className="progress indeterminate">
            <div className="progress-bar secondary dark-1"></div>
        </div> }
        <div className="card">
            <div className="card-content responsive-table-2">
                <table className="table hover">
                    <tbody>
                        {orders.map( (order, key) => <tr key={key} >
                            <td>{ order.code }</td>
                            <td>{ order.firstDeliveryWarehouse ? order.firstDeliveryWarehouse.adress.country.name : ''}</td> 
                            <td>{ order.carrier ? order.carrier.name : ''}</td>
                            <td>{ order.firstLoadingStart }</td>
                            <td>{fulfilled(order.id, order.effectiveFirstLoadingStart)}</td>
                            <td>{bill(order.id, order.invoice)}</td>
                        </tr>)} 
                    </tbody>
                </table>
            </div>
        </div>
        <Pagination 
            currentPage={currentPage}
            length={totalItems}
            onPageChanged={handlePageChange}
        />
    </>    
}
 
export default List;
