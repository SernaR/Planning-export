import axios from 'axios';
import { ORDERS_API}  from './config'

//renomer en planning api

function planning(dateStart, dateEnd) {
    return axios
        .get(ORDERS_API + '?firstLoadingStart[before]=' + dateEnd + '&firstLoadingStart[after]=' + dateStart + '&isCancelled=false&order[code]=asc')
        .then(response => response.data["hydra:member"]);
}


//mettre create et update


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
    planning
    //findAll,
    //update,
    //create,
    //delete : remove
}