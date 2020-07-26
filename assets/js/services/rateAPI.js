
import axios from 'axios';
import { RATE_API}  from './config'

function find(order) {

  let url = RATE_API + 
    `?carrier=${order.carrier}&firstLoadingWarehouse=${order.firstLoadingWarehouse}&firstDeliveryWarehouse=${order.firstDeliveryWarehouse}`

  //2 loading - 2 delivery
  if( order.secondDeliveryWarehouse && order.secondLoadingWarehouse  && order.firstDeliveryWarehouse && order.firstLoadingWarehouse ) {
    url = `${url}&secondLoadingWarehouse=${order.secondLoadingWarehouse}&secondDeliveryWarehouse=${order.secondDeliveryWarehouse}`
  }
  //2 loading - 1 delivery
  else if( order.secondLoadingWarehouse  && order.firstDeliveryWarehouse && order.firstLoadingWarehouse ) {
    url = `${url}&secondLoadingWarehouse=${order.secondLoadingWarehouse}&exists[secondDeliveryWarehouse]=false`
  }
  //1 loading - 2 delivery
  else if( order.secondDeliveryWarehouse && order.firstDeliveryWarehouse && order.firstLoadingWarehouse ) {
    url = `${url}&exists[secondLoadingWarehouse]=false&secondDeliveryWarehouse=${order.secondDeliveryWarehouse}`
  }
  //1 loading - 1 delivery
  else if( order.firstDeliveryWarehouse && order.firstLoadingWarehouse ) {
    url = `${url}&exists[secondLoadingWarehouse]=false&exists[secondDeliveryWarehouse]=false`
  }

  return axios
      .get(url)
      .then(response => response.data["hydra:member"][0].amount);
}  

export default { find }