import axios from 'axios';

const fetcher = url => fetch(url, {
  headers: {
      'Accept': 'application/ld+json',
    }
  }).then(r => r.json())

function findAll(url) {
  return axios
      .get(url)
      .then(response => response.data["hydra:member"]);
} 

function find(url, id) {
  return axios
      .get(url + '/' + id)
      .then(response => response.data);
}

function create(url, data) {
  return axios
    .post(url, data)
}

function update(url, id, data) {
  return axios
    .put(url + '/' + id, data)
}

export default { fetcher, find, create, update }


