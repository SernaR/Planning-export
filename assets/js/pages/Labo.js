import React from 'react';
import useSWR from 'swr'

const fetcher = url => fetch(url, {
    headers: {
        'Accept': 'application/json',
        //"Content-Type": "application/json" 
      }
    }).then(r => r.json())

const List = (props) => {
    const { data, error } = useSWR('/api/transport_orders', fetcher)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return <div>{ JSON.stringify(data, null, 4) }</div>
}
 
export default List;