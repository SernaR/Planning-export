import axios from 'axios';
import { COUNTRY_API}  from './config'

function findAll(id) {
  return axios
      .get(COUNTRY_API + '?country=' + id)
      .then(response => response.data["hydra:member"][0]);
}  

export default { findAll }
