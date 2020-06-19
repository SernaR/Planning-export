import axios from 'axios';
import { ORDERS_API}  from './config'

function findAll() {
    return axios
        .get(ORDERS_API)
        .then(response => response.data["hydra:member"]);
}

function remove(id) {
    return axios.delete(ORDERS_API + "/" + id)
}

function update(id, invoice) {
    return axios
        .put(ORDERS_API + '/' + id, 
        { ...invoice, customer:`/api/customers/${invoice.customer}`})
}

function create(invoice) {
    return axios
    .post(ORDERS_API,
     { ...invoice, customer:`/api/customers/${invoice.customer}`})
}

export default {
    //findAll,
    //update,
    //create,
    //delete : remove
}