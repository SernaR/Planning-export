const API_URL = 'https://localhost:8000/api/'

function findAllByCountry(id) {
    return fetch(API_URL + 'params/init/' + id, {
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json" 
          },
        })
        .then( result => result.json())
}

function setup() {
  return fetch(API_URL + 'params/init', {
      headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json" 
        },
      })
      .then( result => result.json())
}

function create(order, params) {
  //creer une logique pour les parametres suivants les entrepots
  return fetch(API_URL + 
    'order/create/'+ params.carrier + 
    '/' + params.vehicle + 
    '/' + params.firstLoadingWarehouse + 
    '/' + params.firstDeliveryWarehouse, {
      headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json" 
        },
      method: 'post',
      body: JSON.stringify(order)  
      })
      .then( result => result.json())
}

export default { findAllByCountry, create, setup }
