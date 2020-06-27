import { useState, useCallback } from "react";

export function usePaginatedFetch(url) {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const [count, setCount] = useState(0)

    const load = useCallback( async() => {
        setLoading(true)
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/ld+json',
              }
            })
        const responseData = await response.json()

        if(response.ok) {
            setItems(responseData['hydra:member'])
            setCount(responseData['hydra:totalItems'])
        } else {
            console.error(responseData)
        }
        setLoading(false)
    }, [url])
    
    return {
        items,
        load,
        count,
        loading
    }
}
 
