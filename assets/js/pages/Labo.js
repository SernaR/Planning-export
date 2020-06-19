import React from 'react';
import useSWR from 'swr'
import { CREATE_SETUP_API }  from '../services/config'

const fetcher = url => fetch(url, {
    headers: {
        'Accept': 'application/json',
        //"Content-Type": "application/json" 
      }
    }).then(r => r.json())

const List = (props) => {
    const { data, error } = useSWR(CREATE_SETUP_API, fetcher)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return <div>{ JSON.stringify(data, null, 4) }</div>
}
 
export default List;