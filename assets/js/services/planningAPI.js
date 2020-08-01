import axios from 'axios';
import { ORDERS_API}  from './config'


function findAll(dateStart, dateEnd) {
    return axios
        .get(ORDERS_API + '?firstLoadingStart[before]=' + dateEnd + '&firstLoadingStart[after]=' + dateStart + '&isCancelled=false&order[code]=asc')
        .then(response => response.data["hydra:member"]);
}

export default { findAll }