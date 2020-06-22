
import axios from 'axios';
import { RATE_API}  from './config'

function find(order) {
  return axios
      .get(RATE_API + '?carrier=' + order.carrier + '&firstLoadingWarehouse=' + order.firstLoadingWarehouse+ '&firstDeliveryWarehouse=' + order.firstDeliveryWarehouse)
      .then(response => response.data["hydra:member"][0].amount);
}  

export default { find }
